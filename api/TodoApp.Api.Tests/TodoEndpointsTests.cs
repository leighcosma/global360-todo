using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Time.Testing;
using TodoApp.Api.Todos;

namespace TodoApp.Api.Tests;

public sealed class TodoEndpointsTests : IDisposable
{
    private readonly FakeTimeProvider _clock = new();
    private readonly WebApplicationFactory<Program> _factory;
    private readonly HttpClient _client;

    public TodoEndpointsTests()
    {
        _factory = new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
            builder.ConfigureServices(services => services.AddSingleton<TimeProvider>(_clock)));
        _client = _factory.CreateClient();
    }

    public void Dispose()
    {
        _client.Dispose();
        _factory.Dispose();
    }

    [Fact]
    public async Task GetAll_ReturnsEmptyTodoList_WhenNothingAdded()
    {
        var response = await _client.GetAsync("/api/todos");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var fetched = await response.Content.ReadFromJsonAsync<TodoResponse[]>();
        Assert.NotNull(fetched);
        Assert.Empty(fetched);
    }

    [Fact]
    public async Task GetAll_ReturnsTodoList_AfterAdd()
    {
        var item = TodoItem.Create("Test", _clock);
        var repository = _factory.Services.GetRequiredService<ITodoRepository>();
        await repository.AddAsync(item);

        var response = await _client.GetAsync("/api/todos");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var fetched = await response.Content.ReadFromJsonAsync<TodoResponse[]>();
        Assert.NotNull(fetched);
        Assert.Single(fetched);
        Assert.Equal(item.Id, fetched[0].Id);
        Assert.Equal(item.Title, fetched[0].Title);
    }

    [Fact]
    public async Task Get_ReturnsTodoItem_WhenFound()
    {
        var item = TodoItem.Create("Write test", _clock);
        var repository = _factory.Services.GetRequiredService<ITodoRepository>();
        await repository.AddAsync(item);

        var response = await _client.GetAsync($"/api/todos/{item.Id}");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var fetched = await response.Content.ReadFromJsonAsync<TodoResponse>();
        Assert.NotNull(fetched);
        Assert.Equal(item.Id, fetched.Id);
        Assert.Equal(item.Title, fetched.Title);
    }

    [Fact]
    public async Task Get_ReturnsNotFound_WhenItemNotFound()
    {
        var response = await _client.GetAsync($"/api/todos/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsCreatedTodoItem_WhenValid()
    {
        var request = new CreateTodoRequest("Write test");

        var response = await _client.PostAsJsonAsync("/api/todos", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var fetched = await response.Content.ReadFromJsonAsync<TodoResponse>();
        Assert.NotNull(fetched);
        Assert.Equal(request.Title, fetched.Title);
        Assert.Equal(_clock.GetUtcNow(), fetched.CreatedAt);
        Assert.NotNull(response.Headers.Location);
        var followUp = await _client.GetAsync(response.Headers.Location);
        Assert.Equal(HttpStatusCode.OK, followUp.StatusCode);
    }

    [Fact]
    public async Task Create_TrimsTitle()
    {
        var request = new CreateTodoRequest("  Write test  ");

        var response = await _client.PostAsJsonAsync("/api/todos", request);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        var fetched = await response.Content.ReadFromJsonAsync<TodoResponse>();
        Assert.NotNull(fetched);
        Assert.Equal("Write test", fetched.Title);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenTitleIsEmpty()
    {
        var request = new CreateTodoRequest("");

        var response = await _client.PostAsJsonAsync("/api/todos", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Create_ReturnsBadRequest_WhenTitleIsTooLong()
    {
        var request = new CreateTodoRequest(new string('a', TodoItem.TitleMaxLength + 1));

        var response = await _client.PostAsJsonAsync("/api/todos", request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<HttpValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.Contains("Title", problem.Errors.Keys);
    }

    [Fact]
    public async Task Create_ReturnsConflict_WhenTitleAlreadyExists()
    {
        var request = new CreateTodoRequest("Write test");
        await _client.PostAsJsonAsync("/api/todos", request);

        var response = await _client.PostAsJsonAsync("/api/todos", request);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<HttpValidationProblemDetails>();
        Assert.NotNull(problem);
        Assert.Contains("Title", problem.Errors.Keys);
    }

    [Fact]
    public async Task Delete_ReturnsNoContent_WhenFound()
    {
        var item = TodoItem.Create("Write test", _clock);
        var repository = _factory.Services.GetRequiredService<ITodoRepository>();
        await repository.AddAsync(item);

        var response = await _client.DeleteAsync($"/api/todos/{item.Id}");

        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        var followUp = await _client.GetAsync($"/api/todos/{item.Id}");
        Assert.Equal(HttpStatusCode.NotFound, followUp.StatusCode);
    }

    [Fact]
    public async Task Delete_ReturnsNotFound_WhenMissing()
    {
        var response = await _client.DeleteAsync($"/api/todos/{Guid.NewGuid()}");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
