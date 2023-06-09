using System.ComponentModel.DataAnnotations;

namespace ppm360.Models;

public class Project
{
    [Key]
    public int Id { get; set; }
    public required string Name { get; set; }
    public string ProjectType { get; set; }
    public string ProjectManager { get; set; }
    public string ExecutiveUnit { get; set; }
    public string ProjectStatus { get; set; }
    public double Budget { get; set; }
    public double InternalCost { get; set; }
    public double ExternalCost { get; set; }
    public double Investments { get; set; }
    public string TeamSize { get; set; }
    public string InvolvedBusinessUnits { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public DateOnly CreatedAt { get; set; }
    public string ApplicantUser { get; set; }
    public int ProjectManagerWorkload { get; set; }
    public String Digitalisation { get; set; }
    public String ProjectDescription { get; set; }
    public String AffectedLocation { get; set; }
    public String ResponsibleLocation { get; set; }
    public String CustomerSatisfaction { get; set; }
    public String EverydayBenefit { get; set; }
    public int ProjectRisk { get; set; }
    public int ExternalStakeholders { get; set; }
    public int BufferDays { get; set; }
    public String Experience { get; set; }
    public String SolutionScopeProcess { get; set; }
    public String SolutionScopeFunctional { get; set; }
    public int SupportEffort { get; set; }
    public double TurnoverIncreaseY1 { get; set; }
    public double TurnoverIncreaseY2 { get; set; }
    public double TurnoverIncreaseY3 { get; set; }
    public double TurnoverIncreaseY4 { get; set; }
    public double TurnoverIncreaseY5 { get; set; }
    public double CostSavingsY1 { get; set; }
    public double CostSavingsY2 { get; set; }
    public double CostSavingsY3 { get; set; }
    public double CostSavingsY4 { get; set; }
    public double CostSavingsY5 { get; set; }
    public double CapitalValue { get; set; }
    public double ProjectCost { get; set; }
    public double CostReduction { get; set; }
    public List<Dictionary<string, string>> Comments { get; set; }
}
