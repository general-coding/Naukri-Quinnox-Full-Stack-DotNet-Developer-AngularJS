using EasyGroceries.Server.Models;

namespace EasyGroceries.Server.Services
{
    public class OrderProcessor
    {
        private static int _orderCounter = 1000;

        public ShippingSlip ProcessOrder(Order order)
        {
            if (order.IncludeLoyalty)
            {
                foreach (var line in order.Lines)
                {
                    line.Product.Price *= 0.8m; // Apply 20% discount
                }
                order.Lines.Add(new OrderLine
                {
                    Product = new Product { Id = 999, Name = "EasyGroceries loyalty membership", Price = 5.00m, IsPhysical = false },
                    Quantity = 1
                });
            }

            var slip = new ShippingSlip
            {
                CustomerId = order.CustomerId,
                OrderNumber = _orderCounter++,
                ShippedItems = order.Lines.Where(l => l.Product.IsPhysical).ToList()
            };

            return slip;
        }
    }
}
