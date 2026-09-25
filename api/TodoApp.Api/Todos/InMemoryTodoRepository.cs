using System.Collections.Concurrent;

namespace TodoApp.Api.Todos;

public sealed class InMemoryTodoRepository : ITodoRepository
{
    private readonly ConcurrentDictionary<Guid, TodoItem> _items = new();

    // Dictionary order isn't insertion order, so sort on the way out
    public Task<IReadOnlyList<TodoItem>> GetAllAsync()
    {
        IReadOnlyList<TodoItem> items = _items.Values
            .OrderBy(item => item.CreatedAt)
            .ToList();

        return Task.FromResult(items);
    }

    public Task<TodoItem?> GetByIdAsync(Guid id) =>
        Task.FromResult(_items.GetValueOrDefault(id));

    public Task AddAsync(TodoItem item)
    {
        _items[item.Id] = item;
        return Task.CompletedTask;
    }

    public Task<bool> ExistsAsync(string title) =>
        Task.FromResult(_items.Values.Any(item => item.Title.Equals(title, StringComparison.OrdinalIgnoreCase)));

    public Task<bool> DeleteAsync(Guid id) =>
        Task.FromResult(_items.TryRemove(id, out _));
}
