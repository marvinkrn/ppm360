using System.ComponentModel.DataAnnotations;

namespace ppm360.Models;

public class AnnualBudget
{
    [Key]
    public int Year { get; set; }
    public double Budget { get; set; }
}
