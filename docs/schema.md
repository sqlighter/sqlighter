## Database schema

units                   A biomarker's measurement unit, eg. µmol_L
  id                    string              µmol_L
  description           string              Micromole per liter
  extras                json                Conversions, aliases, etc.


biomarkers              A type of biomarker, eg glucose level
  id                    string              Code, eg. glucose
  status                string              draft, published, archived
  date_created          datetime            Item first created on
  date_updated          datetime            Item last updated on
  translations          fk to biomarker_translations (one per language)
    name                string              Glucose
    description         string              A type of sugar
    summary             markdown            A few paragraphs describing biomarker
  units                 fk to units         Unit of measurement for biomarker
  risks                 string              Specially formatted string with optimal ranges, etc.
  tags                  json                Biomarker tags used to group
  extras                json                Aliases, links, synonims, links, etc...


results                 A single reading of a biomarker, eg. glucose level from a blood test
  id                    int
  value                 decimal             
  notes                 string


records                 A health record, eg. laboratory results from a blood exam
  id                    int
  status
  user_id               uuid






lab_results             Lab results include multiple biomarkers and analysis 
    id
    status
    user_created
    user_updated
    user_id
    date_created
    date_updated
    name                string
    description         string
    summary             markdown
    documents   
    biomarkers          fk to biomarkers (one to many)


biomarkers

units                   Measurement units and conversions
    id                  string          10^12/L
    description         string          units per liter
    extras              json            references, conversions, etc.


readings                A single reading of a biomarker, eg. glucose level


records                 A generic health record, eg. a collection of biomarkers in a lab report

    type                string          lab, etc.



posts                   A post or article

    id
    status
    date_created
    date_updated
    user_created
    user_updated


languages               Languages supported by the application

  code                  string              en-US
  name                  string              English


