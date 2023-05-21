namespace ppm360.Models;

public class Project
{


    public int Id { get; set; }
    public required string Name { get; set; }
    public string ProjectType { get; set; }
    public string ProjectManager { get; set; }
    public string ProjectStatus { get; set; }
    public double Budget { get; set; }
    //public double InternalCost { get; set; }
    public string TeamSize { get; set; }
    public string InvolvedBusinessUnits { get; set; } // Data type string?
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public DateOnly CreatedAt { get; set; }
    public string ApplicantUser { get; set; }
    public Dictionary<string, string> Comments { get; set; } // Dictionary username, comment
}
