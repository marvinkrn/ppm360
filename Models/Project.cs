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
    public int pmWorkload { get; set; }
    public String digitalisation { get; set; }
    public String projectDescription { get; set; }
    public String affectedLocation { get; set; }
    public String responsibleLocation { get; set; }
    public String customerSatisfaction { get; set; }
    public String everydayBenefit { get; set; }
    public int projectRisk { get; set; }
    public int externalStakeholders { get; set; }
    public int bufferDays { get; set; }
    public String experience { get; set; }
    public int solutionScopeProcess { get; set; }
    public int solutionScopeExtend { get; set; }
    public int supportExpense { get; set; }
    public double turnoverIncrease1 { get; set; }
    public double turnoverIncrease2 { get; set; }
    public double turnoverIncrease3 { get; set; }
    public double turnoverIncrease4 { get; set; }
    public double turnoverIncrease5 { get; set; }
    public double costSavings1 { get; set; }
    public double costSavings2 { get; set; }
    public double costSavings3 { get; set; }
    public double costSavings4 { get; set; }
    public double costSavings5 { get; set; }
    public double projectCost { get; set; }
    public double costReduction { get; set; }

    public Dictionary<string, string> Comments { get; set; } // Dictionary username, comment
}
