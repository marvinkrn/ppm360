using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace ppm360.Migrations
{
    /// <inheritdoc />
    public partial class PPM360Migration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Projects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ProjectType = table.Column<string>(type: "text", nullable: false),
                    ProjectManager = table.Column<string>(type: "text", nullable: false),
                    ExecutiveUnit = table.Column<string>(type: "text", nullable: false),
                    ProjectStatus = table.Column<string>(type: "text", nullable: false),
                    Budget = table.Column<double>(type: "double precision", nullable: false),
                    InternalCost = table.Column<double>(type: "double precision", nullable: false),
                    ExternalCost = table.Column<double>(type: "double precision", nullable: false),
                    Investments = table.Column<double>(type: "double precision", nullable: false),
                    TeamSize = table.Column<string>(type: "text", nullable: false),
                    InvolvedBusinessUnits = table.Column<string>(type: "text", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: false),
                    CreatedAt = table.Column<DateOnly>(type: "date", nullable: false),
                    ApplicantUser = table.Column<string>(type: "text", nullable: false),
                    ProductManagerWorkload = table.Column<int>(type: "integer", nullable: false),
                    Digitalisation = table.Column<string>(type: "text", nullable: false),
                    ProjectDescription = table.Column<string>(type: "text", nullable: false),
                    AffectedLocation = table.Column<string>(type: "text", nullable: false),
                    ResponsibleLocation = table.Column<string>(type: "text", nullable: false),
                    CustomerSatisfaction = table.Column<string>(type: "text", nullable: false),
                    EverydayBenefit = table.Column<string>(type: "text", nullable: false),
                    ProjectRisk = table.Column<int>(type: "integer", nullable: false),
                    ExternalStakeholders = table.Column<int>(type: "integer", nullable: false),
                    BufferDays = table.Column<int>(type: "integer", nullable: false),
                    Experience = table.Column<string>(type: "text", nullable: false),
                    SolutionScopeProcess = table.Column<string>(type: "text", nullable: false),
                    SolutionScopeFunctional = table.Column<string>(type: "text", nullable: false),
                    SupportEffort = table.Column<int>(type: "integer", nullable: false),
                    TurnoverIncreaseY1 = table.Column<double>(type: "double precision", nullable: false),
                    TurnoverIncreaseY2 = table.Column<double>(type: "double precision", nullable: false),
                    TurnoverIncreaseY3 = table.Column<double>(type: "double precision", nullable: false),
                    TurnoverIncreaseY4 = table.Column<double>(type: "double precision", nullable: false),
                    TurnoverIncreaseY5 = table.Column<double>(type: "double precision", nullable: false),
                    CostSavingsY1 = table.Column<double>(type: "double precision", nullable: false),
                    CostSavingsY2 = table.Column<double>(type: "double precision", nullable: false),
                    CostSavingsY3 = table.Column<double>(type: "double precision", nullable: false),
                    CostSavingsY4 = table.Column<double>(type: "double precision", nullable: false),
                    CostSavingsY5 = table.Column<double>(type: "double precision", nullable: false),
                    CapitalValue = table.Column<double>(type: "double precision", nullable: false),
                    ProjectCost = table.Column<double>(type: "double precision", nullable: false),
                    CostReduction = table.Column<double>(type: "double precision", nullable: false),
                    Comments = table.Column<List<Dictionary<string, string>>>(type: "hstore[]", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "User",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Username = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_User", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Projects");

            migrationBuilder.DropTable(
                name: "User");
        }
    }
}
