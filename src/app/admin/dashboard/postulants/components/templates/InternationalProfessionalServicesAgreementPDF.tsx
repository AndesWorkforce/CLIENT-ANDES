import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

type Data = {
  nombreCompleto: string;
  nacionalidad?: string; // Country
  cedula: string; // ID number
  descripcionServicios?: string; // Clause One paragraph
  ofertaSalarial?: string; // monthly fee number USD
  montoEnLetrasUSD?: string; // amount in words
  fechaInicioLabores?: string; // Start date (MM/DD/YYYY or parseable)
  fechaEjecucion?: string; // Execution/Signature date
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 11,
    paddingTop: 40,
    paddingLeft: 60,
    paddingRight: 60,
    paddingBottom: 40,
    lineHeight: 1.4,
  },
  header: { alignItems: "center", marginBottom: 10 },
  logo: { width: 120, height: 60 },
  title: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginVertical: 10,
  },
  paragraph: { marginBottom: 10, textAlign: "justify", lineHeight: 1.5 },
  bold: { fontFamily: "Helvetica-Bold" },
  underline: { borderBottomWidth: 1, borderBottomColor: "#000" },
  listItem: { marginLeft: 12, marginBottom: 6 },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureCol: { width: "45%" },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 28,
    marginBottom: 6,
  },
});

const fmtMoney = (v?: string) => {
  if (!v) return "_____";
  const n = Number(v);
  if (isNaN(n)) return v;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const parseMDY = (s?: string) => {
  if (!s) return null;
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const [, mm, dd, yyyy] = m;
    return new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

const dayOf = (d?: string) => {
  const dt = parseMDY(d);
  return dt ? String(dt.getDate()) : "___";
};
const monthOf = (d?: string) => {
  const dt = parseMDY(d);
  return dt ? dt.toLocaleDateString("en-US", { month: "long" }) : "_____";
};
const yearOf = (d?: string) => {
  const dt = parseMDY(d);
  return dt ? String(dt.getFullYear()) : "______";
};

const InternationalProfessionalServicesAgreementPDF: React.FC<{
  data: Data;
}> = ({ data }) => {
  const defaultClauseOne =
    "maintaining client files, answering phone calls, communicating with prospective and current clients, processing legal documents, initiating claims and appeals, providing information related to client cases, uploading PDF documents to electronic portals, gathering information from potential clients and submitting it for review, processing intake documents and entering information digitally, confirming clients’ medical appointments, assisting clients with required forms, and performing additional tasks as assigned";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src="/images/logo-andes.png" style={styles.logo} />
        </View>

        <Text style={styles.title}>
          INTERNATIONAL PROFESSIONAL SERVICES AGREEMENT
        </Text>

        <Text style={styles.paragraph}>
          This{" "}
          <Text style={styles.bold}>
            INTERNATIONAL PROFESSIONAL SERVICES AGREEMENT
          </Text>{" "}
          is entered into by and between Andes Workforce LLC, a limited
          liability company registered in the State of Florida, United States,
          identified with registration number L24000192685, hereinafter referred
          to as “COMPANY,” and{" "}
          <Text style={styles.underline}>
            {data.nombreCompleto || "Full name of THE CONTRACTOR"}
          </Text>
          , a national of{" "}
          <Text style={styles.underline}>{data.nacionalidad || "Country"}</Text>
          , identified with ID No.{" "}
          <Text style={styles.underline}>{data.cedula || "number"}</Text>,
          hereinafter referred to as “THE CONTRACTOR.”
        </Text>

        <Text style={styles.paragraph}>
          This agreement shall be governed by the following clauses and,
          subsidiary, by the applicable civil and commercial laws of THE
          CONTRACTOR’s country of residence, without creating any employment
          relationship between the parties under any circumstances.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE ONE – PURPOSE:
        </Text>
        <Text style={styles.paragraph}>
          THE CONTRACTOR, acting independently, professionally, and under their
          sole responsibility, shall provide the following services:{" "}
          {data.descripcionServicios?.trim()?.length
            ? data.descripcionServicios
            : defaultClauseOne}
          .
        </Text>
        <Text style={styles.paragraph}>
          Likewise, THE CONTRACTOR shall perform all ordinary, related, and
          complementary services necessary for the optimal execution of the
          duties described, in accordance with their skills and experience, to
          support the company’s operational functions and enhance customer
          service management.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE TWO – MONTHLY FEE:
        </Text>
        <Text style={styles.paragraph}>
          The parties agree that the compensation for the services provided by
          THE CONTRACTOR shall be ($
          {fmtMoney(data.ofertaSalarial)} USD) (
          <Text style={styles.underline}>
            {data.montoEnLetrasUSD || "AMOUNT IN WORDS"}
          </Text>
          ), payable on a monthly basis during the term of this agreement.
        </Text>
        <Text style={styles.listItem}>
          Paragraph One: The parties establish that the current payment period
          is MONTHLY, and any changes to this schedule, whether due to necessity
          or company decision, shall be communicated in due course.
        </Text>
        <Text style={styles.listItem}>
          Paragraph Two: THE CONTRACTOR freely, expressly, and voluntarily
          acknowledges and accepts that the agreed compensation for the services
          under this agreement shall be paid in foreign currency, specifically
          in United States Dollars (USD), and that such payment shall be made
          via international transfer or any other method mutually agreed upon by
          the parties.
        </Text>
        <Text style={styles.listItem}>
          Paragraph Three: Any additional expenses not foreseen in this
          agreement must be previously approved in writing by the COMPANY.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE THREE – INCENTIVES, BONUSES, AND ANNUAL FEE ADJUSTMENT:
        </Text>
        <Text style={styles.listItem}>
          1. Incentives and Bonuses: THE CONTRACTOR may receive incentives for
          meeting goals defined by THE COMPANY, as well as semiannual or annual
          bonuses for outstanding performance, goal evaluations, or overall
          contract results.
        </Text>
        <Text style={styles.listItem}>
          2. Annual Fee Adjustment: The agreed fees shall automatically increase
          by 5% each year. This increase shall not be considered salary nor
          generate employment benefits, given the civil/commercial nature of
          this agreement.
        </Text>
        <Text style={styles.listItem}>
          3. Payment Conditions: The payment of any incentive, bonus, or
          adjustment shall be subject to verification of goal achievement,
          submission of required reports, and express approval by THE COMPANY.
        </Text>
        <Text style={styles.listItem}>
          4. Civil/Commercial Nature: The incentives, bonuses, and adjustments
          provided herein do not constitute salary nor create an employment
          relationship. THE CONTRACTOR acts with technical and administrative
          autonomy in the provision of services.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE FOUR – PAYMENT METHOD:
        </Text>
        <Text style={styles.paragraph}>
          THE COMPANY agrees to pay THE CONTRACTOR the full amount of fees
          established in Clause Two, in accordance with the applicable
          regulations in THE CONTRACTOR’s country of residence. If local law
          requires proof of social security contributions, taxes, or other legal
          obligations, payment may be conditioned upon the submission of such
          documents by THE CONTRACTOR.
        </Text>
        <Text style={styles.paragraph}>
          Paragraph one: The parties agree to comply with the tax, fiscal, and
          social security obligations applicable in the relevant jurisdiction.
          THE CONTRACTOR shall be responsible for submitting the required
          documentation only when mandated by local law.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE FIVE – TERM OF THE AGREEMENT:
        </Text>
        <Text style={styles.paragraph}>
          This agreement shall remain in effect for four (4) months from the
          date of signing. The start date of this contract shall be the{" "}
          {dayOf(data.fechaInicioLabores)} day of{" "}
          {monthOf(data.fechaInicioLabores)}, {yearOf(data.fechaInicioLabores)}.
          If, upon expiration of the term, neither party notifies the other in
          writing of its decision not to renew the agreement at least thirty
          (30) calendar days in advance, the agreement shall be automatically
          renewed for a period equal to the initial term or the term of the last
          renewal, as applicable.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE SIX – SPECIAL OBLIGATIONS OF COMPANY:
        </Text>
        <Text style={styles.listItem}>
          1. Pay the agreed compensation to THE CONTRACTOR within the terms and
          conditions set forth in this agreement.
        </Text>
        <Text style={styles.listItem}>
          2. Provide the tools, materials, information, or platform access
          necessary for the execution of the contract.
        </Text>
        <Text style={styles.listItem}>
          3. Respond to information requests from THE CONTRACTOR.
        </Text>
        <Text style={styles.listItem}>
          4. Verify that THE CONTRACTOR complies with applicable tax, fiscal,
          and social security obligations if required by local law.
        </Text>
        <Text style={styles.listItem}>
          5. Fulfill all other obligations under this agreement, its annexes,
          and applicable laws and regulations.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE SEVEN – SPECIAL OBLIGATIONS OF THE CONTRACTOR:
        </Text>
        <Text style={styles.listItem}>
          1. Perform the contracted services diligently, in good faith, and in
          accordance with this agreement and the guidelines, procedures,
          protocols, policies, and quality standards established by THE COMPANY.
        </Text>
        <Text style={styles.listItem}>
          2. Provide sufficient and necessary assistance to meet THE COMPANY’s
          needs and ensure proper coordination and support of contract-related
          activities.
        </Text>
        <Text style={styles.listItem}>
          3. Offer timely, efficient, and appropriate service to users or
          clients, following THE COMPANY’s instructions and promptly responding
          to inquiries.
        </Text>
        <Text style={styles.listItem}>
          4. Promptly inform THE COMPANY of any circumstances that may affect
          the fulfillment of contractual obligations.
        </Text>
        <Text style={styles.listItem}>
          5. Refrain from disclosing, using, or disposing of THE COMPANY’s
          information, documents, or work materials without express
          authorization, and from issuing false or inaccurate reports.
        </Text>
        <Text style={styles.listItem}>
          6. Maintain the integrity and good condition of any work tools
          provided, being liable for damage caused by negligence or fault.
        </Text>
        <Text style={styles.listItem}>
          7. Return all information, records, files, or documents obtained
          during the contract, in physical or digital format, upon termination.
        </Text>
        <Text style={styles.listItem}>
          8. Refrain from performing work for Andes Workforce LLC or its clients
          while physically present in the United States. If traveling to the
          U.S. or its territories, THE CONTRACTOR must notify THE COMPANY to
          suspend the contract.
        </Text>
        <Text style={styles.listItem}>
          9. Comply with all other obligations arising from this agreement, its
          annexes, and applicable laws and regulations.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE EIGHT – NATURE OF THE AGREEMENT:
        </Text>
        <Text style={styles.paragraph}>
          The relationship between the parties is of a civil and commercial
          nature, without creating any employment relationship, dependency, or
          subordination. THE CONTRACTOR assumes the inherent risks of their
          professional activity and shall be solely responsible for compliance
          with applicable legal obligations.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE NINE – EARLY TERMINATION:
        </Text>
        <Text style={styles.listItem}>
          1. By mutual written agreement between the parties.
        </Text>
        <Text style={styles.listItem}>
          2. Due to breach by either party of the obligations set forth herein.
        </Text>
        <Text style={styles.listItem}>
          3. Due to total or partial breach by THE CONTRACTOR not remedied
          within five (5) business days following written notice from THE
          COMPANY.
        </Text>
        <Text style={styles.listItem}>
          4. Due to duly proven force majeure or unforeseeable circumstances.
        </Text>
        <Text style={styles.listItem}>
          5. At any time, by unilateral decision of THE COMPANY.
        </Text>
        <Text style={styles.paragraph}>
          Paragraph One: The five (5) business day period to declare a breach
          shall only apply if the breach is remediable by the defaulting party.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE TEN – DISPUTE RESOLUTION:
        </Text>
        <Text style={styles.paragraph}>
          Any controversy, conflict, or dispute related to this agreement shall
          first be resolved through direct negotiation within a maximum of
          thirty (30) calendar days. If no resolution is reached, THE PARTIES
          shall submit to the competent courts of the applicable country or to
          international arbitration in the language agreed upon by the parties.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE ELEVEN – CONFIDENTIALITY AND NON-DISCLOSURE:
        </Text>
        <Text style={styles.paragraph}>
          All information about THE COMPANY and/or the CONTRACTOR accessed under
          this agreement shall be treated as confidential. Neither party shall
          disclose the terms of this agreement or any technical, commercial,
          client database, or financial information received from the other
          party without prior written consent.
        </Text>
        <Text style={styles.paragraph}>
          FIRST PARAGRAPH: Confidentiality obligations cease only when required
          by law or court order; the information becomes public domain; or the
          receiving party develops it independently, without breaching this
          agreement.
        </Text>
        <Text style={styles.paragraph}>
          SECOND PARAGRAPH: If either PARTY is required by order of a public or
          judicial authority to disclose information subject to confidentiality,
          that party shall promptly inform the party to whom the information
          pertains so it may take steps to protect its confidentiality. In the
          absence of protective measures, the PARTIES may provide only the
          portion of the information strictly required by the authority, making
          their best efforts to preserve confidentiality.
        </Text>
        <Text style={styles.paragraph}>
          THIRD PARAGRAPH: Information used or developed in the normal course of
          providing the service is the exclusive property of THE COMPANY and is
          strictly confidential. THE CONTRACTOR agrees not to disclose or use
          such information for personal benefit.
        </Text>
        <Text style={styles.paragraph}>
          FOURTH PARAGRAPH: It is a breach by THE CONTRACTOR to make any
          unauthorized copy, remove materials without authorization, or disclose
          information by any means.
        </Text>
        <Text style={styles.paragraph}>
          FIFTH PARAGRAPH – INTERNATIONAL LEGAL COMPLIANCE: THE CONTRACTOR
          acknowledges the applicability of national and international norms,
          including fundamental principles recognized by the ILO, and assumes
          full responsibility for compliance.
        </Text>
        <Text style={styles.paragraph}>
          SIXTH PARAGRAPH: THE CONTRACTOR shall be liable for any damage caused
          to the company due to violation of confidentiality obligations, and
          legal actions may be initiated.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE TWELVE – PROVISION OF WORK EQUIPMENT FOR SECURITY AND
          CONFIDENTIALITY PURPOSES:
        </Text>
        <Text style={styles.paragraph}>
          THE COMPANY may provide work equipment (hardware/software) for proper
          execution of the agreement. Equipment remains property of THE COMPANY,
          to be used only for the agreement, and returned in good condition upon
          termination.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE THIRTEEN – DATA PROTECTION:
        </Text>
        <Text style={styles.paragraph}>
          Both parties agree to protect personal data according to applicable
          laws and international standards (GDPR, OECD). Data is used only for
          the purposes of this agreement, with measures to ensure security and
          confidentiality.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE FOURTEEN – EXECUTORY NATURE:
        </Text>
        <Text style={styles.paragraph}>
          This agreement constitutes a binding and enforceable contract. Parties
          acknowledge its validity, enforceability, and evidentiary value.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE FIFTEEN – ASSIGNMENT:
        </Text>
        <Text style={styles.paragraph}>
          Neither party may assign its rights or obligations under this
          agreement without prior written consent of the other party.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE SIXTEEN – DISCOVERIES AND INVENTIONS:
        </Text>
        <Text style={styles.paragraph}>
          All inventions, improvements, or outcomes arising from THE
          CONTRACTOR’s activities are the exclusive property of THE COMPANY. THE
          CONTRACTOR agrees to assist in patenting or formalizing such results
          without additional compensation.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE SEVENTEEN – EFFECTS:
        </Text>
        <Text style={styles.paragraph}>
          This agreement supersedes and nullifies any prior verbal or written
          agreements between the parties.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE EIGHTEEN – AMENDMENTS:
        </Text>
        <Text style={styles.paragraph}>
          This agreement may only be amended by written agreement signed by both
          PARTIES.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 10 }]}>
          Signed electronically on the {dayOf(data.fechaEjecucion)} day of{" "}
          {monthOf(data.fechaEjecucion)}, {yearOf(data.fechaEjecucion)}.
        </Text>

        <View style={styles.signatureRow}>
          <View style={styles.signatureCol}>
            <Text>COMPANY,</Text>
            <View style={styles.signatureLine} />
            <Text>Andes Workforce LLC</Text>
            <Text>Name: __________________________</Text>
          </View>
          <View style={styles.signatureCol}>
            <Text>THE CONTRACTOR,</Text>
            <View style={styles.signatureLine} />
            <Text>
              Name: {data.nombreCompleto || "__________________________"}
            </Text>
            <Text>Country: {data.nacionalidad || "________________"}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InternationalProfessionalServicesAgreementPDF;
