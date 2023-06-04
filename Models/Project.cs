namespace ppm360.Models;

public class Project
{


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
    public string InvolvedBusinessUnits { get; set; } // Data type string?
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public DateOnly CreatedAt { get; set; }
    public string ApplicantUser { get; set; }
    public int PmWorkload { get; set; }
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
    public int SolutionScopeProcess { get; set; }
    public int SolutionScopeExtend { get; set; }
    public int SupportExpense { get; set; }
    public double TurnoverIncrease1 { get; set; }
    public double TurnoverIncrease2 { get; set; }
    public double TurnoverIncrease3 { get; set; }
    public double TurnoverIncrease4 { get; set; }
    public double TurnoverIncrease5 { get; set; }
    public double CostSavings1 { get; set; }
    public double CostSavings2 { get; set; }
    public double CostSavings3 { get; set; }
    public double CostSavings4 { get; set; }
    public double CostSavings5 { get; set; }
    public double CapitalValue { get; set; }
    public double ProjectCost { get; set; }
    public double CostReduction { get; set; }

    public Dictionary<string, string> Comments { get; set; } // Dictionary username, comment
}
