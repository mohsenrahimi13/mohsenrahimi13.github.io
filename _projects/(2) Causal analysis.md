---
name: P900 Schools Program Impact Analysis
tools: [R, Difference-in-Differences, Regression Analysis]
description: An in-depth analysis of the impact of Chile's P900 Schools Program on student achievement based on robust econometric models.
---

# P900 Schools Program Impact Analysis

This project investigates the **impact of Chile’s P900 Schools Program** on student achievement. It draws on the difference-in-differences regression model to estimate the effects on 1988-1990 and 1988-1992 test score gains.

## Background

The P900 program aimed to improve the educational outcomes in underperforming schools. For more background on the program and the data, see the paper titled "The Central Role of Noise in the Evaluation of Interventions that Use Test Scores to Rank Schools" by Kenneth Chay, Patrick McEwan, and Miguel Urquiola, published in the American Economic Review in September 2005.

### Estimated Effects

We estimate the impact of the P900 program using a difference-in-differences approach with the following regression models:

1990 Average Gain Score: `dx90 = α + θ * P900 + (ej90 - ej88)` (1.1)

1992 Average Gain Score: `dx92 = α + θ * P900 + (ej92 - ej88)` (1.2)

The estimates suggest that the P900 program had a substantial and positive effect on the treated schools, increasing the mean gain scores by 5.05099 in 1990 and 7.72928 in 1992.

### Summary Statistics

For non-treated schools (P900=0):

| Observation    | Mean     | Standard Deviation | Minimum Value | Maximum Value |
| -------------- | -------- | ------------------ | ------------- | ------------- |
| '88 score      | 55.7281  | 8.6432             | 28.87         | 81.555        |
| '90 gain score | 4.5816   | 7.0353             | -15.985       | 28.38         |
| '92 gain score | 10.9402  | 7.0292             | -11.9645      | 33.4205       |

For treated schools (P900=1):

| Observation    | Mean     | Standard Deviation | Minimum Value | Maximum Value |
| -------------- | -------- | ------------------ | ------------- | ------------- |
| '88 score      | 39.6033  | 3.4147             | 30.88         | 48.46         |
| '90 gain score | 9.6326   | 7.3992             | -5.695        | 30.77499      |
| '92 gain score | 18.6694  | 7.6092             | 0.7825012     | 47.937        |


## Table C: Regression outcomes from equations (1.1.) and (1.2)

|               | (1)       | (2)       |
| ------------- |:---------:|:---------:|
| **Variables** | 1988-1990 | 1988-1990 |
| P900 treatment| 5.051***  | 7.729***  |
|               | (0.847)   | (0.869)   |
| ß0            | 4.582***  | 10.94***  |
|               | (0.294)   | (0.296)   |
| Observations  | 658       | 651       |
| R-squared     | 0.055     | 0.120     |

Robust standard errors in parentheses  
*** p<0.01, ** p<0.05, * p<0.1

### B.1 Bias from Noise and Mean Reversion

**Describe how the estimates in (a) may be biased by noise and mean reversion.**

As indicated by Chay et al., mean reversion can be identified as the outgrowth of imprecisely measured mean test scores (Kenneth et al., 2005). This bias can undermine the quality of the research design, especially in the selection of the treated group when the noise is transitory. Transitory noises, such as a widespread illness among students or distracting environmental noise, can negatively affect mean score values in both treated and non-treated schools. The impact is particularly pronounced in schools with low enrollment rates, where the smaller sample size results in greater variability and hence more observable changes in mean score gains.

**Error-Components Model**

## Error Components Model

The authors modeled these error components through the following equations:

**For 1988:**
`y_j_bar88 = λ_j + u_j88 + Σ(1/N_j88 * α_i88) for i in j` (2)

**For 1990:**
`y_j_bar90 = λ_j + u_j90 + Σ(1/N_j90 * α_i90) for i in j` (3)

Where `y_bar_ij88` and `y_bar_ij90` are the mean test scores in 1988 and 1990 at the school level, `λ_j` is the school-level permanent effect, `u_jt` is the school-level transitory shock in years ‘88 and ’90, and the summation `Σ(α_it/N_jt)` represents the average student’s ability for students i within school j at time t. In this study, the students sampled are from the 4th-grade cohort, and `N_j` indicates the school's enrollment size.

## Summary of The key findings

The study employs various empirical methods, including reduced form and two-stage least squares regressions, to evaluate the program's effectiveness. The regressions are controlled for cubic and quadratic functions of the 1988 scores and an interaction term between the 1988 score and school size, which helps in addressing the mean reversion bias.

Key findings suggest that the introduction of control variables in the regression framework significantly affects the estimated impact of the P900 treatment. The more controls are introduced, the lower the estimated effect, with controlled regressions halving the predictions compared to uncontrolled ones.

The analysis also includes nonparametric smoothing techniques to plot the relationship between the probability of receiving P900 and the school's 1988 score relative to the regional cutoff. The results indicate a significant number of schools were correctly assigned to the treatment or control group, with minimal manipulation in the assignment across the three regions.

Summary statistics for treated and non-treated schools show that aided schools had a lower average score in 1988, but experienced higher score gains in subsequent years, suggesting a positive impact of the P900 program.

The project's robust statistical approach provides valuable insights into the P900 program's impact, contributing to the broader field of impact evaluation in educational policies.
