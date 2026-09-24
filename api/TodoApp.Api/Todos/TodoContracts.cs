using System.ComponentModel.DataAnnotations;

namespace TodoApp.Api.Todos;

public sealed record CreateTodoRequest(
    [property: Required, StringLength(TodoItem.TitleMaxLength)] string Title);

public sealed record TodoResponse(Guid Id, string Title, DateTimeOffset CreatedAt)
{
    public static TodoResponse From(TodoItem item) => new(item.Id, item.Title, item.CreatedAt);
}
