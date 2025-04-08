namespace EasyGroceries.Server.Models
{
    public class OrderLine
    {
        public Product Product { get; set; } = new();
        public int Quantity { get; set; }
    }
}
