namespace EasyGroceries.Server.Models
{
    public class ShippingSlip
    {
        public int CustomerId { get; set; }
        public int OrderNumber { get; set; }
        public List<OrderLine> ShippedItems { get; set; } = new();
    }
}
