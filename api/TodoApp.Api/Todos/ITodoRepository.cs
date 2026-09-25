namespace TodoApp.Api.Todos;

public interface ITodoRepository
{
    Task<IReadOnlyList<TodoItem>> GetAllAsync();
    Task<TodoItem?> GetByIdAsync(Guid id);
    Task AddAsync(TodoItem item);
    Task<bool> ExistsAsync(string title);
    Task<bool> DeleteAsync(Guid id);
}
