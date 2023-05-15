namespace ppm360.Models;

public class Project
{
    public int Id { get; set; }
    public string Name { get; set; }

    public string ApplicantUser { get; set; } // maybe change to use username instead of id, wird später eh in cookie gespeichert?
    public List<string> Comments { get; set; } //Kommentare, wenn projekt z.b. abgelehnt wird
    public string ProjectType { get; set; }
    public string ProjectManager { get; set; } // change to: ProjectManager
    public double Budget { get; set; }
    public DateOnly CreatedAt { get; set; } // creation date // Change to: CreationDate oder "createdAt"
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string ProjectStatus { get; set; }

    //public string Priority { get; set; }
    public int TeamSize { get; set; }
    public List<string> AffectedDepartments { get; set; }
}
