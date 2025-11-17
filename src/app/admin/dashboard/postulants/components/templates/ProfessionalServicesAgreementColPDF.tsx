import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";

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
  header: { alignItems: "center", marginBottom: 20 },
  logo: { width: 120, height: 60 },
  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginVertical: 12,
  },
  paragraph: { marginBottom: 10, textAlign: "justify", lineHeight: 1.5 },
  listItem: { marginLeft: 12, marginBottom: 6 },
  bold: { fontFamily: "Helvetica-Bold" },
  underline: { borderBottomWidth: 1, borderBottomColor: "#000" },
  signatureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
  },
  signatureCol: { width: "45%" },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    height: 28,
    marginBottom: 6,
  },
});

type Data = {
  nombreCompleto: string;
  cedula: string;
  nacionalidad?: string;
  ofertaSalarial?: string; // numeric USD
  montoEnLetrasUSD?: string; // amount in words
  fechaInicioLabores?: string; // MM/DD/YYYY
  fechaEjecucion?: string; // Month D, YYYY or MM/DD/YYYY
  // Editable text to customize Clause One – Purpose
  descripcionServicios?: string;
  // Prefer this specific PSA field if provided
  psaClauseOne?: string;
};

const fmtMoney = (v?: string) => {
  if (!v) return "_______";
  const n = Number(v);
  if (isNaN(n)) return v;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const parseMDY = (s?: string) => {
  if (!s) return null;
  // Try MM/DD/YYYY first
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
  return dt ? String(dt.getDate()) : "_____";
};
const monthOf = (d?: string) => {
  const dt = parseMDY(d);
  return dt ? dt.toLocaleDateString("en-US", { month: "long" }) : "________";
};
const yearOf = (d?: string) => {
  const dt = parseMDY(d);
  return dt ? String(dt.getFullYear()) : "20__";
};

const ProfessionalServicesAgreementColPDF: React.FC<{ data: Data }> = ({
  data,
}) => {
  const defaultServicios =
    "maintaining client files, answering phone calls, speaking with potential and current clients, processing legal documents, initiating claims and appeals, providing case-related information, uploading PDFs to electronic portals, gathering potential client information for review, processing admission documents and entering data digitally, confirming client medical appointments, assisting with required forms, and performing additional tasks as assigned";
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src="/images/logo-andes.png" style={styles.logo} />
        </View>

        <Text style={styles.title}>PROFESSIONAL SERVICES AGREEMENT</Text>

        <Text style={styles.paragraph}>
          This Professional Services Agreement is entered into by and between
          Andes Workforce LLC (&quot;COMPANY&quot;), registered under Limited
          Liability Company No. L24000192685, with its principal place of
          business in Florida, United States, and{" "}
          <Text style={styles.underline}>
            {data.nombreCompleto || "__________________________"}
          </Text>
          , identified with Citizenship ID No.{" "}
          <Text style={styles.underline}>
            {data.cedula || "__________________________"}
          </Text>
          , of{" "}
          <Text style={styles.underline}>
            {data.nacionalidad || "__________________________"}
          </Text>{" "}
          nationality, hereinafter referred to as the CONTRACTOR. Collectively,
          they shall be referred to as THE PARTIES and agree to the following
          terms governed by the Colombian Civil and Commercial Codes and
          applicable regulations.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE ONE – PURPOSE:
        </Text>
        <Text style={styles.paragraph}>
          The CONTRACTOR shall independently, professionally, and under their
          sole responsibility, provide services including:{" "}
          {data.psaClauseOne && data.psaClauseOne.trim().length > 0
            ? data.psaClauseOne
            : data.descripcionServicios &&
              data.descripcionServicios.trim().length > 0
            ? data.descripcionServicios
            : defaultServicios}
          .
        </Text>
        <Text style={styles.paragraph}>
          Additionally, the CONTRACTOR shall perform all ordinary, related, and
          complementary services necessary for the optimal execution of the
          functions described, according to their capacity and experience, to
          support the COMPANY’s operations and enhance customer service
          management. THE PARTIES expressly declare that the execution of these
          services does not create any employment relationship between the
          CONTRACTOR and COMPANY, in accordance with the Colombian Labor Code
          and Civil Code.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE TWO – CONTRACT VALUE:
        </Text>
        <Text style={styles.paragraph}>
          THE PARTIES agree that the fee for services rendered by the CONTRACTOR
          shall be ($
          {fmtMoney(data.ofertaSalarial)} USD) (
          <Text style={styles.underline}>
            {data.montoEnLetrasUSD || "AMOUNT IN WORDS"}
          </Text>
          ) payable monthly during the term of this agreement.
        </Text>
        <Text style={styles.listItem}>
          Paragraph One: The payment period is currently monthly and may be
          modified by the COMPANY as needed, with due notice.
        </Text>
        <Text style={styles.listItem}>
          Paragraph Two: The CONTRACTOR freely and expressly accepts that the
          agreed fees will be paid in U.S. dollars (USD), via international
          transfer or another mutually agreed method.
        </Text>
        <Text style={styles.listItem}>
          Paragraph Three: Any additional expenses not foreseen in this contract
          must be pre-approved in writing by the COMPANY.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE THREE – INCENTIVES, BONUSES, AND ANNUAL FEE ADJUSTMENT:
        </Text>
        <Text style={styles.listItem}>
          • Incentives and Bonuses: Based on goal achievement and performance
          evaluations.
        </Text>
        <Text style={styles.listItem}>
          • Annual Adjustment: Fees will automatically increase by 5% annually,
          not being considered a salary or generating employment benefits.
        </Text>
        <Text style={styles.listItem}>
          • Payment Conditions: Subject to verification of goals, report
          submission, and express approval by the COMPANY.
        </Text>
        <Text style={styles.listItem}>
          • Civil/Commercial Nature: These payments do not constitute a salary
          or an employment relationship.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE FOUR – PAYMENT METHOD:
        </Text>
        <Text style={styles.paragraph}>
          The COMPANY shall pay the CONTRACTOR the agreed monthly fee upon
          receipt of proof that the CONTRACTOR has made the required
          contributions to the Colombian Social Security System (health,
          pension, and occupational risks). Payment shall be made via electronic
          transfer to the account provided in writing by the CONTRACTOR, on the
          last business day of each month, conditional upon verification that
          the CONTRACTOR has fully complied with all contractual obligations
          under this Agreement.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE FIVE – CONTRACT DURATION:
        </Text>
        <Text style={styles.paragraph}>
          This contract shall be valid for four (4) months from the date of
          signing. The start date of this contract shall be the{" "}
          {dayOf(data.fechaInicioLabores)} day of{" "}
          {monthOf(data.fechaInicioLabores)}, {yearOf(data.fechaInicioLabores)}.
        </Text>
        <Text style={styles.paragraph}>
          If neither party gives written notice of termination at least thirty
          (30) calendar days before expiration, the contract will automatically
          renew for the same period.
        </Text>
        <Text style={styles.paragraph}>
          The total duration, including renewals, shall not exceed four (4)
          years, in accordance with Colombian Civil and Commercial Law.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE SIX – COMPANY’S OBLIGATIONS:
        </Text>
        <Text style={styles.listItem}>• Pay the agreed fee on time.</Text>
        <Text style={styles.listItem}>
          • Provide necessary tools, materials, and platform access.
        </Text>
        <Text style={styles.listItem}>
          • Respond to reasonable information requests.
        </Text>
        <Text style={styles.listItem}>
          • Verify social security contributions.
        </Text>
        <Text style={styles.listItem}>
          • Comply with all applicable obligations under this agreement and the
          law.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE SEVEN – CONTRACTOR’S OBLIGATIONS:
        </Text>
        <Text style={styles.listItem}>
          • Perform services diligently and in good faith.
        </Text>
        <Text style={styles.listItem}>
          • Provide sufficient assistance to meet the COMPANY&apos;s operational
          needs.
        </Text>
        <Text style={styles.listItem}>
          • Offer timely and efficient customer service.
        </Text>
        <Text style={styles.listItem}>
          • Notify the COMPANY of any issues affecting performance.
        </Text>
        <Text style={styles.listItem}>
          • Not disclose or misuse confidential information.
        </Text>
        <Text style={styles.listItem}>
          • Maintain and return work equipment in good condition.
        </Text>
        <Text style={styles.listItem}>
          • Avoid performing services for Andes Workforce LLC or its clients
          while in U.S. territory.
        </Text>
        <Text style={styles.listItem}>
          • Comply with all contractual and legal obligations.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE EIGHT – NATURE OF THE RELATIONSHIP:
        </Text>
        <Text style={styles.paragraph}>
          This is a civil and commercial agreement governed by the Colombian
          Civil and Commercial Codes. No employment relationship is created, and
          no labor or social benefits are generated.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE NINE – EARLY TERMINATION:
        </Text>
        <Text style={styles.listItem}>• Mutual written agreement.</Text>
        <Text style={styles.listItem}>• Breach of obligations.</Text>
        <Text style={styles.listItem}>
          • Unremedied breach lasts more than five (5) business days.
        </Text>
        <Text style={styles.listItem}>
          • Force majeure or unforeseen events.
        </Text>
        <Text style={styles.listItem}>
          • Unilateral decision by the COMPANY, with prior notice.
        </Text>
        <Text style={styles.paragraph}>
          Paragraph one: The five-day remedy period applies only to remediable
          breaches.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE TEN – DISPUTE RESOLUTION:
        </Text>
        <Text style={styles.paragraph}>
          Any disputes arising under this agreement shall first be resolved
          through direct negotiation within thirty (30) calendar days. If no
          resolution is reached, Colombian law shall govern, and the courts of
          Bogotá D.C., Colombia shall have authority.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE ELEVEN – CONFIDENTIALITY:
        </Text>
        <Text style={styles.paragraph}>
          All information exchanged between THE PARTIES is strictly
          confidential. Disclosure requires prior written consent.
        </Text>
        <Text style={styles.paragraph}>
          Paragraph One: Confidentiality obligations shall cease only when
          disclosure is legally required, the information becomes public, or it
          is independently developed without breaching this agreement.
        </Text>
        <Text style={styles.paragraph}>
          Paragraph Two: If either PARTY is required by any public,
          governmental, or judicial authority to disclose Confidential
          Information under this Agreement, it shall, as soon as legally
          possible, provide prior written notice to the other PARTY whose
          information is affected, so that confidentiality protections or legal
          remedies may be implemented. In the absence of protective measures,
          the disclosing PARTY may only disclose the portion of Confidential
          Information strictly required by the authority, while making best
          efforts to preserve confidentiality and obtain protective orders or
          reasonable assurances that such information will be treated
          confidentially by said authority.
        </Text>
        <Text style={styles.paragraph}>
          Paragraph Three: All information used or developed during the service
          provision is the exclusive property of the COMPANY and strictly
          confidential. The CONTRACTOR agrees not to disclose such information
          to third parties or use it for personal benefit, especially if such
          disclosure could harm the COMPANY.
        </Text>
        <Text style={styles.paragraph}>
          Paragraph Four: Any unauthorized copying, removal, or disclosure of
          documents or files (in any medium) shall be considered a breach of
          contract.
        </Text>
        <Text style={styles.paragraph}>
          Paragraph Five: The CONTRACTOR acknowledges that ignorance of the law
          is no excuse and understands that Colombian and international laws
          impose sanctions for violations related to confidentiality and unfair
          competition.
        </Text>
        <Text style={styles.paragraph}>
          Paragraph Six: The CONTRACTOR shall be liable for any damage caused to
          the COMPANY due to violation of confidentiality obligations, and legal
          action may be initiated accordingly.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE TWELVE – WORK EQUIPMENT:
        </Text>
        <Text style={styles.paragraph}>
          If the COMPANY provides work equipment for security and
          confidentiality purposes:
        </Text>
        <Text style={styles.listItem}>
          • Equipment remains COMPANY property and must be used solely for
          contractual duties.
        </Text>
        <Text style={styles.listItem}>
          • Equipment must be returned to good condition.
        </Text>
        <Text style={styles.listItem}>
          • Damage or misuse may result in repair or replacement costs and legal
          action.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE THIRTEEN – DATA PROTECTION:
        </Text>
        <Text style={styles.paragraph}>
          In accordance with Colombian Data Protection Law (Law 1581 of 2012),
          THE PARTIES authorize the processing of personal data necessary for
          contract execution. Both parties commit to confidentiality and
          compliance with data protection regulations.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE FOURTEEN – EXECUTIVE MERIT:
        </Text>
        <Text style={styles.paragraph}>
          This agreement constitutes an enforceable obligation under Colombian
          law (Articles 422 and 424 of the General Procedure Code).
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE FIFTEEN – ASSIGNMENT:
        </Text>
        <Text style={styles.paragraph}>
          Neither party may transfer their contractual rights or obligations
          without prior written consent of the other.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE SIXTEEN – INVENTIONS:
        </Text>
        <Text style={styles.paragraph}>
          Any invention, improvement, or development made by the CONTRACTOR
          while performing the contracted services shall be the exclusive
          property of the COMPANY, which may patent or protect them without
          additional compensation.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE SEVENTEEN – ENTIRE AGREEMENT:
        </Text>
        <Text style={styles.paragraph}>
          This document supersedes any prior verbal or written agreements
          between THE PARTIES.
        </Text>

        <Text style={[styles.bold, { marginTop: 10 }]}>
          CLAUSE EIGHTEEN – AMENDMENTS:
        </Text>
        <Text style={styles.paragraph}>
          This contract may only be amended in writing, signed by both PARTIES.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 14 }]}>
          This contract is signed on the {dayOf(data.fechaEjecucion)} day of{" "}
          {monthOf(data.fechaEjecucion)}, {yearOf(data.fechaEjecucion)}.
        </Text>

        <View style={styles.signatureRow}>
          <View style={styles.signatureCol}>
            <Text>CONTRACTOR,</Text>
            <View style={styles.signatureLine} />
            <Text>
              Name: {data.nombreCompleto || "__________________________"}
            </Text>
            <Text>Citizenship ID No.: {data.cedula || "________________"}</Text>
          </View>
          <View style={styles.signatureCol}>
            <Text>COMPANY,</Text>
            <View style={styles.signatureLine} />
            <Text>Name: __________________________</Text>
            <Text>Position: Andes Workforce LLC</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ProfessionalServicesAgreementColPDF;
