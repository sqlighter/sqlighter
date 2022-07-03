//
// faq.tsx - area with few FAQs and answers in accordions
//

import { SxProps, Theme } from "@mui/material"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Accordion from "@mui/material/Accordion"
import AccordionSummary from "@mui/material/AccordionSummary"
import AccordionDetails from "@mui/material/AccordionDetails"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import Button from "@mui/material/Button"

import { Spacer } from "./spacer"

const Faq_SxProps: SxProps<Theme> = {
  ".Faq-title": {
    fontWeight: "bold",
    marginBottom: 3,
  },
  ".Faq-link": {
    marginTop: 1,
    marginLeft: -1,
  },

  ".MuiPaper-root.MuiAccordion-root.Mui-expanded:before": {
    opacity: 1,
    display: "block",
  },

  ".MuiPaper-root.MuiAccordion-root.Mui-expanded + .MuiPaper-root.MuiAccordion-root.Mui-expanded:before": {
    opacity: 1,
    display: "block",
  },

  ".MuiAccordion-root": {
    backgroundColor: "transparent",
    boxShadow: "none",
    border: "none",
  },

  ".MuiAccordionSummary-root": {
    paddingLeft: 0,
  },

  ".MuiAccordionSummary-expandIconWrapper": {
    color: "primary.main",
  },

  ".MuiAccordionDetails-root": {
    userSelect: "none",
    paddingLeft: 0,
  },
}

interface FaqProps {
  /** Classname applied to component and subcomponents */
  className?: string
  /** Main title for section, default FAQ */
  title?: string
  /** FAQs shown */
  faqs: { title: string; description: string; link?: string }[]
}

/** A set of questions with expandable answers */
export function Faq(props: FaqProps) {
  const className = "Faq-root" + (props.className ? " " + props.className : "")

  return (
    <Box className={className} sx={Faq_SxProps}>
      <Spacer />
      <Typography className="Faq-title" variant="h4">
        {props.title || "FAQ"}
      </Typography>
      {props.faqs.map((faq, index) => (
        <Accordion key={index} square disableGutters>
          <AccordionSummary className="Faq-question" expandIcon={<ExpandMoreIcon />}>
            <Typography color="text.primary">{faq.title}</Typography>
          </AccordionSummary>
          <AccordionDetails className="Faq-answer">
            <Typography color="text.secondary">{faq.description}</Typography>
            {faq.link && (
              <Button className="Faq-link" variant="text" href={faq.link}>
                Learn More
              </Button>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
      <Spacer />
    </Box>
  )
}
