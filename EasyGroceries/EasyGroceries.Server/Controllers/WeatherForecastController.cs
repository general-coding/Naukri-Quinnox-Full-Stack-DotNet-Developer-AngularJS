using EasyGroceries.Server.Models;
using EasyGroceries.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace EasyGroceries.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;

        public WeatherForecastController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetWeatherForecast")]
        public IEnumerable<WeatherForecast> Get()
        {
            return Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                TemperatureC = Random.Shared.Next(-20, 55),
                Summary = Summaries[Random.Shared.Next(Summaries.Length)]
            })
            .ToArray();
        }

        private readonly OrderProcessor _processor = new();

        [HttpGet("products")]
        public IActionResult GetProducts()
        {
            var products = new List<Product>
            {
                new Product { Id = 1, Name = "Milk", Description = "The best of cows", Price = 2.50m, IsPhysical = true },
                new Product { Id = 2, Name = "Bread", Description = "Easy toast", Price = 1.75m, IsPhysical = true },
                new Product { Id = 3, Name = "Eggs", Description = "Wild chicken", Price = 3.00m, IsPhysical = true }
            };
            return Ok(products);
        }

        [HttpPost("submit")]
        public IActionResult SubmitOrder([FromBody] Order order)
        {
            var slip = _processor.ProcessOrder(order);
            return Ok(slip);
        }
    }
}
