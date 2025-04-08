using EasyGroceries.Server.Models;
using EasyGroceries.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace EasyGroceries.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
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
