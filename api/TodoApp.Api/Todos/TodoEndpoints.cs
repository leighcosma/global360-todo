namespace TodoApp.Api.Todos;

public static class TodoEndpoints
{
    public static void MapTodoEndpoints(this WebApplication app)
    {
        var todoGroup = app.MapGroup("/todos");

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
            if (string.IsNullOrWhiteSpace(request.Title) || request.Title.Length > 200)
            {
                return Results.BadRequest("Title is required and must be 200 characters or fewer.");
            }
            var item = TodoItem.Create(request.Title, clock);
            await repository.AddAsync(item);
            return Results.Created($"/todos/{item.Id}", item);
        });

        todoGroup.MapDelete("/{id:guid}", async (Guid id, ITodoRepository repository) =>
        {
            var deleted = await repository.DeleteAsync(id);
            return deleted ? Results.NoContent() : Results.NotFound();
        });
    }
}
