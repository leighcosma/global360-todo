using Microsoft.Extensions.Time.Testing;
using TodoApp.Api.Todos;

namespace TodoApp.Api.Tests;

public class InMemoryTodoRepositoryTests
{
    private readonly FakeTimeProvider _clock = new();
    private readonly InMemoryTodoRepository _repository = new();

    [Fact]
    public async Task GetAllAsync_ReturnsEmpty_WhenNothingAdded()
    {
        var items = await _repository.GetAllAsync();

        Assert.Empty(items);
    }

    [Fact]
    public async Task GetAllAsync_ReturnsItem_AfterAdd()
    {
        var item = TodoItem.Create("Test", _clock);
        await _repository.AddAsync(item);

        var fetched = await _repository.GetAllAsync();

        Assert.Single(fetched);
        Assert.Equal(item, fetched[0]);
    }

    [Fact]
    public async Task GetAllAsync_OrdersByCreatedAt()
    {
        var first = TodoItem.Create("Write first test", _clock);
        _clock.Advance(TimeSpan.FromSeconds(1));
        var second = TodoItem.Create("Write second test", _clock);

        await _repository.AddAsync(second);
        await _repository.AddAsync(first);

        var fetched = await _repository.GetAllAsync();

        Assert.Equal([first, second], fetched);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsItem_WhenFound()
    {
        var item = TodoItem.Create("Write test", _clock);
        await _repository.AddAsync(item);

        var fetched = await _repository.GetByIdAsync(item.Id);

        Assert.Equal(item, fetched);
    }

    [Fact]
    public async Task GetByIdAsync_ReturnsNull_WhenNotFound()
    {
        var fetched = await _repository.GetByIdAsync(Guid.NewGuid());

        Assert.Null(fetched);
    }

    [Fact]
    public async Task DeleteAsync_ReturnsTrue_WhenFound()
    {
        var item = TodoItem.Create("Write test", _clock);
        await _repository.AddAsync(item);

        var deleted = await _repository.DeleteAsync(item.Id);

        Assert.True(deleted);
        Assert.Null(await _repository.GetByIdAsync(item.Id));
    }

    [Fact]
    public async Task DeleteAsync_ReturnsFalse_WhenNotFound()
    {
        var deleted = await _repository.DeleteAsync(Guid.NewGuid());

        Assert.False(deleted);
    }
}
