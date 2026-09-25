namespace TodoApp.Api.Todos;

public static class TodoEndpoints
{
    public static void MapTodoEndpoints(this WebApplication app)
    {
        var todoGroup = app.MapGroup("/api/todos");

        todoGroup.MapGet("/", async (ITodoRepository repository) =>
        {
            var items = await repository.GetAllAsync();
            return Results.Ok(items);
        });

        todoGroup.MapGet("/{id:guid}", async (Guid id, ITodoRepository repository) =>
        {
            var item = await repository.GetByIdAsync(id);
            return item is null ? Results.NotFound() : Results.Ok(item);
        });

        todoGroup.MapPost("/", async (CreateTodoRequest request, ITodoRepository repository, TimeProvider clock) =>
        {
            var title = request.Title.Trim();

            if (string.IsNullOrWhiteSpace(title) || title.Length > 200)
            {
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["Title"] = ["Title is required and must be 200 characters or fewer."],
                });
            }

            if (await repository.ExistsAsync(title))
            {
                return Results.ValidationProblem(new Dictionary<string, string[]>
                {
                    ["Title"] = ["A todo with that title already exists."],
                },
                statusCode: StatusCodes.Status409Conflict);
            }

            var item = TodoItem.Create(title, clock);
            await repository.AddAsync(item);
            return Results.Created($"/api/todos/{item.Id}", item);
        });

        todoGroup.MapDelete("/{id:guid}", async (Guid id, ITodoRepository repository) =>
        {
            var deleted = await repository.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}
