# durham-constabulary

## Issues

 - The site is on ASPX
 - There is a lot of legacy code
 - Design-wise it could be better for User Experience
 - It is not responsive
 - This is public-facing, so should be accessible
 - Running the site through the W3C validator returns 83 errors and  6 warnings 
	 - (link: https://validator.w3.org/check?uri=https%3A%2F%2Fdurham.police.uk%2FPages%2Fdefault.aspx&charset=%28detect+automatically%29&doctype=Inline&group=0)
 - In the developer Console, it returns 56 Errors and 4 Warnings
 - Google Lighthouse reports;
	 - Performance = 88
	 - Accessibility = 81
	 - Best Practices = 69
	 - SEO = 82

## Moving Forward

By putting this on a public repo, I hope that if anything can be improved, then a Pull Request can be made to help on the project.

## Project setup

I've ripped the site, using Site Sucker. Using PHP in this case, as it's open-source, easy to learn, many Developers will know it (instead of using new/edge-case tech).

I'm using `valet` to run this locally on Mac OSX, feel free to use a setup of your choice to get PHP running. There is no database. 
I might add instructions later, however, as each computer has a unique setup and versioning, this is a challenge currently and not a high priority.
