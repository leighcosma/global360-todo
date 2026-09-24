namespace TodoApp.Api.Todos;

public sealed record TodoItem(Guid Id, string Title, DateTimeOffset CreatedAt)
{
    public const int TitleMaxLength = 200;

    public static TodoItem Create(string title, TimeProvider clock) =>
        new (Guid.NewGuid(), title.Trim(), clock.GetUtcNow());
}
