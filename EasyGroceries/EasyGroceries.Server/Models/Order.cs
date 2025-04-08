namespace EasyGroceries.Server.Models
{
    public class Order
    {
        public int CustomerId { get; set; }
        public string ShippingInfo { get; set; } = "";
        public List<OrderLine> Lines { get; set; } = new();
        public bool IncludeLoyalty { get; set; }
    }
}
