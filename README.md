### What is biomarkers.app?  
<img src="https://user-images.githubusercontent.com/2813336/157830851-2f85b42d-d6b1-42db-8549-2b5273bcea98.jpeg" align="right"
     alt="Biomarkers.app" style="margin-left: 24px; width: 240px;" />

[Biomarkers.app](https://biomarkers.app) helps you understand your blood work or lab results and make the proper lifestyle and nutritional choices to help you live better. Learn more with easy to read cards for each biomarker coupled with clear, concise, charts showing the optimal range for each result.  

The goal of this application is to make the lay person understand how biomarkers like [glucose](https://github.com/gionatamettifogo/biomarkers/blob/main/app/contents/biomarkers/glucose.md), [cholesterol](https://github.com/gionatamettifogo/biomarkers/blob/main/app/contents/biomarkers/cholesterol.md), etc work together and affect your health. For example in a complete blood count exam your doctor will look at red blood cells, white blood cells, hemoglobin and other biomarkers together and get the overall picture. The app will supply topics and overall scores for groups of biomarkers to achieve a similar higher order understanding.

Application goals:
- Help users take a proactive role with their health
- Help labs and medical doctors communicate health and prevention goals
- Mobile first; works on tablets and PCs as well
- Short and easy to read cards for broader audiences in the tik tok age
- Curated links to qualified external sources provide quality and depth
- Cooperative, open source approach to contents and code development
- Automatic and manual translations for multiple languages with common base
- Storage of health records helps patients understand long term trends
- Easy sharing of records between lab, patients and doctors with privacy builtin

Longer term goals:
- Apply machine learning to help diagnosing, spot statistical outliers, etc
- Apply statistical techniques to get better personalized ranges for biomarkers based on age, etc
- Provide storage and visualization of other types of documents to become a general health records platform
- Became a platform used by patients and doctors to share data freely and learn from each other

THIS IS WORK IN PROGRESS. THE DEPLOYED APPLICATION IS NOT AT ALL COMPLETE, HAS NOT YET BEEN RELEASED, SOME PAGES MAY BE COMPLETE, SOME HALF DONE, SOME JUST DRAFTS. MANY OF THE CONTENTS ARE LOREM IPSUM PLACEHOLDERS. WE ARE LOOKING FOR COLLABORATORS, ESPECIALLY CONTENT EDITORS.  

### Tools 

The application is built using Next.js with a React frontend and node backend. Github is used as a collaborative CMS for markdown based contents. Directus is used as a backoffice platform for database stored records. The application runs on Vercel and Google Cloud Storage. All code is open sourced and ready to go as a deployable white label app for simple adoption by third parties. See [`/app/README.md`](/app/README.md) and [`/app/package.json`](/app/package.json) for more.  

Please contact us at info@biomarkers.app if interested in helping out or open an issue, or submit a pull request.
