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
  cityCountry?: string; // City, Country domicile
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
          (the &quot;Agreement&quot;) is entered into by and between: Andes
          Workforce LLC, a limited liability company duly organized and existing
          under the laws of the State of Florida, United States of America,
          identified with registration number L24000192685, with its principal
          place of business in the same State (hereinafter referred to as{" "}
          <Text style={styles.bold}>&quot;THE CLIENT&quot;</Text>), and{" "}
          <Text style={styles.underline}>
            {data.nombreCompleto || "Full Name of the Contractor"}
          </Text>
          , of{" "}
          <Text style={styles.underline}>{data.nacionalidad || "Country"}</Text>{" "}
          nationality, domiciled in{" "}
          <Text style={styles.underline}>
            {data.cityCountry || "City, Country"}
          </Text>
          , identified with identity document No.{" "}
          <Text style={styles.underline}>{data.cedula || "Number"}</Text>{" "}
          (hereinafter referred to as{" "}
          <Text style={styles.bold}>&quot;THE CONTRACTOR&quot;</Text>). THE
          CLIENT and THE CONTRACTOR may be referred to individually as a
          &quot;Party&quot; and collectively as the &quot;Parties.&quot;
          WHEREAS, THE CLIENT desires to engage THE CONTRACTOR to provide
          independent professional services; and WHEREAS, THE CONTRACTOR
          represents that he/she has the experience, capacity, and
          qualifications necessary to provide such services; NOW, THEREFORE, the
          Parties hereby agree as follows:
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE ONE – PURPOSE:
        </Text>
        <Text style={styles.paragraph}>
          THE CONTRACTOR, acting as an independent contractor and not as an
          employee, shall perform activities that may include, without
          limitation:{" "}
          {data.descripcionServicios?.trim()?.length
            ? data.descripcionServicios
            : defaultClauseOne}
          . Likewise, THE CONTRACTOR shall provide all ordinary, related, and
          complementary services necessary for the optimal performance of the
          foregoing functions, in accordance with his/her professional capacity
          and experience, in order to support THE CLIENT’s operational
          activities and optimize client service management. The Parties
          expressly acknowledge and agree that the execution of this Agreement
          does not create an employment relationship, partnership, agency, or
          joint venture between THE CONTRACTOR and THE CLIENT, and that this
          Agreement shall be governed by its civil and commercial nature, in
          accordance with the laws applicable in THE CONTRACTOR’S country of
          residence.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE TWO – CONTRACT VALUE:
        </Text>
        <Text style={styles.paragraph}>
          The Parties agree that the professional fees payable to THE CONTRACTOR
          for the services rendered under this Agreement shall be USD ${" "}
          {fmtMoney(data.ofertaSalarial)} (
          <Text style={styles.underline}>
            {data.montoEnLetrasUSD || "United States Dollars (in words)"}
          </Text>
          ), payable on a monthly basis during the term of this Agreement.
        </Text>
        <Text style={styles.listItem}>
          Paragraph One. The Parties establish that the payment period shall be
          monthly. Any modification to the payment period, due to operational
          necessity or company decision, shall be communicated in a timely
          manner.
        </Text>
        <Text style={styles.listItem}>
          Paragraph Two. The Parties freely, expressly, and voluntarily agree
          that payment of the fees under this Agreement shall be made in foreign
          currency, specifically United States Dollars (USD), through an
          international transfer to the payment method designated by THE
          CONTRACTOR.
        </Text>
        <Text style={styles.listItem}>
          Paragraph Three. The contract value shall not be altered or affected
          by fluctuations in the exchange rate of THE CONTRACTOR’s local
          currency. Any expense not expressly contemplated in this Agreement
          must be previously authorized in writing by THE CLIENT in order to be
          reimbursable.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE THREE – INCENTIVES, BONUSES, AND ANNUAL FEE ADJUSTMENT:
        </Text>
        <Text style={styles.listItem}>
          • Incentives and Bonuses. THE CONTRACTOR may receive incentives for
          meeting goals defined by THE CLIENT, as well as semiannual or annual
          bonuses based on outstanding performance, achievement of objectives,
          or overall results obtained under this Agreement.
        </Text>
        <Text style={styles.listItem}>
          • Annual Fee Adjustment. The agreed professional fees shall
          automatically increase by five percent (5%) annually. Such increase
          shall not constitute salary, wages, or compensation of an employment
          nature, nor shall it generate social benefits of any kind, given by
          the civil and commercial nature of this Agreement.
        </Text>
        <Text style={styles.listItem}>
          • Payment Conditions. The payment of any incentive, bonus, or annual
          adjustment shall be subject to verification of compliance with
          applicable goals and objectives, submission of any required reports,
          and the express approval of THE CLIENT.
        </Text>
        <Text style={styles.listItem}>
          • Civil and Commercial Nature. The incentives, bonuses, and fee
          adjustments provided herein do not constitute salary or employment
          compensation and do not create an employment relationship. THE
          CONTRACTOR shall maintain full technical, administrative, and
          professional autonomy in the provision of services.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE FOUR – PAYMENT CONDITIONS AND METHOD:
        </Text>
        <Text style={styles.paragraph}>
          THE CLIENT shall pay THE CONTRACTOR the professional fees established
          in Clause Two by means of transfer to the payment method designated by
          THE CONTRACTOR. Upon making payment, THE CLIENT shall provide THE
          CONTRACTOR with the corresponding payment confirmation or statement.
        </Text>
        <Text style={styles.listItem}>
          Paragraph One. Payment confirmations shall be sent by email or through
          THE CLIENT’s internal platform and shall constitute sufficient
          evidence of compliance with THE CLIENT’s payment obligations.
        </Text>
        <Text style={styles.listItem}>
          Paragraph Two. THE CLIENT shall make payment and issue the
          corresponding receipts only upon THE CONTRACTOR’s full and
          satisfactory compliance with the following conditions: (i) acceptance
          by THE CLIENT of the invoice registered in THE CONTRACTOR’s profile
          for the corresponding billing period; and (ii) submission of proof of
          payment of social security contributions, in accordance with the legal
          requirements applicable to independent contractors in THE CONTRACTOR’s
          country of residence.
        </Text>
        <Text style={styles.listItem}>
          Paragraph Three. Payment shall be deemed conditional upon full
          compliance with the foregoing requirements. THE CLIENT shall not be
          considered in default or breach of this Agreement if THE CONTRACTOR
          fails to fully comply with such conditions.
        </Text>
        <Text style={styles.listItem}>
          Paragraph Four. Any modification, addition, or elimination of payment
          prerequisites must be agreed upon in writing by the Parties and shall
          take effect only as of the date of execution of such written
          agreement.
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
          CLAUSE SIX – SPECIAL OBLIGATIONS OF THE CLIENT:
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
          4. To verify that THE CONTRACTOR has made the corresponding social
          security contributions, in accordance with the laws and regulations
          applicable in THE CONTRACTOR’s country of residence, notwithstanding
          that the payment of such contributions is the sole responsibility of
          THE CONTRACTOR.
        </Text>
        <Text style={styles.listItem}>
          5. Fulfill all other obligations under this agreement, its annexes,
          and applicable laws and regulations.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE SEVEN – SPECIAL OBLIGATIONS OF THE CONTRACTOR:
        </Text>
        <Text style={styles.listItem}>
          1. Professional Diligence and Ethical Standards. THE CONTRACTOR shall
          perform the services with due professional diligence, good faith,
          technical competence, and the standard of care expected of an expert
          in the entrusted matters, applying all applicable regulations,
          administrative procedures, and relevant jurisprudential criteria.
        </Text>
        <Text style={styles.listItem}>
          2. Requests and Clarifications. THE CONTRACTOR shall submit all
          requests, clarifications, and actions deemed necessary and appropriate
          in accordance with this Agreement and with THE CLIENT’s guidelines,
          procedures, protocols, internal policies, and quality standards.
        </Text>
        <Text style={styles.listItem}>
          3. Adequate Assistance. THE CONTRACTOR shall provide sufficient,
          timely, and appropriate assistance to ensure proper coordination,
          execution, and support of the services rendered under this Agreement.
        </Text>
        <Text style={styles.listItem}>
          4. Client Service. THE CONTRACTOR shall provide timely, efficient, and
          adequate attention to clients or users, in strict accordance with THE
          CLIENT’s express instructions and delegated authority.
        </Text>
        <Text style={styles.listItem}>
          5. Notification of Relevant Circumstances. THE CONTRACTOR shall
          promptly inform THE CLIENT of any circumstance that may affect
          compliance with contractual obligations or the proper execution of the
          services.
        </Text>
        <Text style={styles.listItem}>
          6. Confidentiality of Information. THE CONTRACTOR shall strictly
          protect all confidential, reserved, or proprietary information of THE
          CLIENT and shall refrain from disclosing, using, or disposing of such
          information without prior written authorization.
        </Text>
        <Text style={styles.listItem}>
          7. Preservation of Work Tools. THE CONTRACTOR shall preserve the
          integrity and good condition of all work tools and materials provided
          and shall be liable for any damage resulting from fault, negligence,
          or misuse.
        </Text>
        <Text style={styles.listItem}>
          8. Return of Information. Upon termination or expiration of this
          Agreement, THE CONTRACTOR shall promptly return all information,
          records, files, materials, and documents obtained during its
          execution, whether in physical or digital format.
        </Text>
        <Text style={styles.listItem}>
          9. Restriction on Performance of Services within U.S. Territory. THE
          CONTRACTOR shall not perform services for THE CLIENT or its clients
          while physically present within the territory of the United States.
          Any travel to such territory must be reported in advance in order for
          THE CLIENT to determine the suspension of the Agreement during such
          period.
        </Text>
        <Text style={styles.listItem}>
          10. Non-Delegation. THE CONTRACTOR may not assign, subcontract, or
          delegate, in whole or in part, the services, representation, or case
          management entrusted herein without the prior, express, and written
          authorization of THE CLIENT.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE EIGHT – NATURE OF THE AGREEMENT:
        </Text>
        <Text style={styles.paragraph}>
          The relationship between the Parties is strictly of a civil and
          commercial nature. Nothing in this Agreement shall be construed as
          creating an employment relationship, partnership, agency, or
          relationship of dependency or subordination. THE CONTRACTOR assumes
          all risks inherent to the performance of his/her professional activity
          as an independent contractor.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE NINE – EARLY TERMINATION:
        </Text>
        <Text style={styles.listItem}>
          1. By mutual agreement of the Parties, formalized in writing.
        </Text>
        <Text style={styles.listItem}>
          2. By breach by either Party of the obligations set forth herein.
        </Text>
        <Text style={styles.listItem}>
          3. By total or partial breach by THE CONTRACTOR of his/her contractual
          obligations, provided such breach persists for more than five (5)
          business days following written notice from THE CLIENT, when such
          breach is capable of remedy.
        </Text>
        <Text style={styles.listItem}>
          4. By duly proven force majeure or fortuitous event.
        </Text>
        <Text style={styles.listItem}>
          5. By unilateral decision of THE CLIENT, at any time, without the need
          to state cause and without generating any right to compensation or
          indemnification.
        </Text>
        <Text style={styles.listItem}>
          6. When the causes that gave rise to this Agreement have ceased to
          exist.
        </Text>
        <Text style={styles.paragraph}>
          Paragraph One: The five (5) business day period to declare a breach,
          as contemplated in this clause, shall only apply if the breach is
          remediable by the defaulting party.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE TEN – DISPUTE RESOLUTION AND ARBITRATION:
        </Text>
        <Text style={styles.paragraph}>
          Any controversy, dispute, claim, or disagreement arising out of or
          relating to the execution, interpretation, termination, or liquidation
          of this Agreement shall first be submitted to a mandatory conciliation
          or settlement process, which may extend for up to ninety (90) calendar
          days. If no settlement is reached, the dispute shall be finally
          resolved by arbitration seated in the State of Florida, United States
          of America. The substantive law applicable to the merits of the
          dispute shall be the civil and commercial laws of THE CONTRACTOR’s
          country of residence.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE ELEVEN – CONFIDENTIALITY AND NON-DISCLOSURE:
        </Text>
        <Text style={styles.paragraph}>
          All information belonging to THE CLIENT to which THE CONTRACTOR has
          access or knowledge by reason of this Agreement shall be deemed
          confidential and proprietary. Neither Party shall disclose the terms
          of this Agreement or any technical, commercial, financial, or client
          information (including databases, contact details, or records)
          obtained during its execution without the prior written consent of the
          other Party.
        </Text>
        <Text style={styles.listItem}>
          1. Exceptions. Confidentiality obligations shall not apply when
          disclosure is required by law or court or administrative order, when
          the information is in the public domain through no fault of the
          receiving Party, or when independently developed without reference to
          the confidential information.
        </Text>
        <Text style={styles.listItem}>
          2. Mandatory Disclosure. If disclosure is required by competent
          authority, the receiving Party shall promptly notify the owner of the
          information and shall disclose only the portion strictly required,
          using reasonable efforts to preserve confidentiality.
        </Text>
        <Text style={styles.listItem}>
          3. Ownership of Information. All information generated, used, or
          developed in the course of the services under this Agreement shall be
          the exclusive property of THE CLIENT.
        </Text>
        <Text style={styles.listItem}>
          4. Breach. Any unauthorized disclosure, loss, or misuse of
          confidential information shall constitute a material breach of this
          Agreement.
        </Text>
        <Text style={styles.listItem}>
          5. International Legal Compliance. THE CONTRACTOR acknowledges that
          applicable national laws, international treaties, and labor,
          commercial, and criminal regulations impose obligations and sanctions
          for breach of confidentiality.
        </Text>
        <Text style={styles.listItem}>
          6. Liability. THE CONTRACTOR shall be liable for all damages caused to
          THE CLIENT as a result of any breach of the confidentiality
          obligations set forth herein, without prejudice to any other legal
          remedies available to THE CLIENT.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE TWELVE – SUPPLY OF WORK EQUIPMENT FOR SECURITY AND
          CONFIDENTIALITY:
        </Text>
        <Text style={styles.paragraph}>
          Where necessary to ensure cybersecurity, protect data confidentiality,
          and safeguard THE CLIENT’s private and institutional information, THE
          CLIENT may, at its sole discretion, provide THE CONTRACTOR with work
          equipment, including hardware and/or software, exclusively for the
          performance of the services under this Agreement. The provision of
          such equipment shall not constitute a general or permanent obligation
          of THE CLIENT and shall apply only to certain contractors, based on
          operational, technical, and security needs determined by THE CLIENT.
        </Text>
        <Text style={styles.listItem}>
          1. Conditions of Supply. Where the provision of equipment or tools is
          deemed necessary for optimal service performance, THE CLIENT shall
          establish in writing the applicable conditions of delivery, permitted
          use, maintenance, and return.
        </Text>
        <Text style={styles.listItem}>
          2. Ownership and Use Restrictions. Any equipment provided shall remain
          the exclusive property of THE CLIENT, and its use shall be strictly
          limited to the performance of obligations under this Agreement. THE
          CONTRACTOR shall safeguard, use, and maintain such equipment with due
          diligence and shall refrain from installing unauthorized software,
          altering security configurations, or using the equipment for personal
          or non-contractual purposes.
        </Text>
        <Text style={styles.listItem}>
          3. Return and Liability. The equipment shall be returned to THE CLIENT
          in good working condition, except for normal wear and tear resulting
          from proper use, upon termination of this Agreement or upon request by
          THE CLIENT. Any damage, loss, or misuse attributable to THE CONTRACTOR
          may result in repair or replacement obligations, without prejudice to
          any legal actions available to THE CLIENT.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE THIRTEEN – DATA PROCESSING AND PROTECTION:
        </Text>
        <Text style={styles.paragraph}>
          The Parties undertake to process and protect personal data in
          accordance with applicable data protection laws in THE CONTRACTOR’s
          country of residence, internationally recognized standards, and
          applicable laws of the State of Florida, United States of America,
          including, without limitation, the European Union’s General Data
          Protection Regulation (GDPR), the guidelines of the Organisation for
          Economic Co-operation and Development (OECD), the Florida Digital Bill
          of Rights (FLDBOR), and the Florida Information Protection Act (FIPA),
          as applicable. Such processing may include the collection, storage,
          use, circulation, updating, transfer, or deletion of personal data,
          directly or through duly authorized third parties, always under
          principles of legality, security, confidentiality, proportionality,
          and legitimate purpose. Personal data shall be used solely for the
          fulfillment of contractual obligations and service-related purposes.
          Each Party shall implement appropriate technical and organizational
          measures to ensure data security and confidentiality and shall respect
          the rights of data subjects, including rights of access,
          rectification, erasure, objection, restriction, and portability, as
          applicable. Any international transfer of personal data shall comply
          with applicable legal requirements. Each Party shall be liable for its
          own non-compliance with data protection obligations and shall
          cooperate with competent authorities when required.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE FOURTEEN – ENFORCEABILITY AND EXECUTORY MERIT:
        </Text>
        <Text style={styles.paragraph}>
          This Agreement constitutes a valid, binding, and enforceable contract
          between the Parties. Its compliance may be demanded judicially or
          extrajudicially in accordance with applicable laws before any
          competent court or arbitral tribunal. The Parties expressly
          acknowledge that the obligations set forth herein are clear, express,
          and enforceable, and that this Agreement constitutes full and
          sufficient evidence of its existence, validity, and enforceability. In
          accordance with principles of contractual good faith and
          internationally recognized standards of private international law, the
          Parties agree that this Agreement shall be granted full legal
          validity, evidentiary value, and enforceability in any legal or
          arbitral proceeding in which it is submitted, subject to the formal
          requirements of the competent jurisdiction.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE FIFTEEN – ASSIGNMENT:
        </Text>
        <Text style={styles.paragraph}>
          THE CONTRACTOR may not assign, transfer, or otherwise dispose of, in
          whole or in part, his/her rights or contractual position under this
          Agreement without the prior, express, and written authorization of THE
          CLIENT.
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
          CLAUSE SEVENTEEN – SUPERVISION:
        </Text>
        <Text style={styles.paragraph}>
          The supervision of this Agreement shall be exercised directly by THE
          CLIENT, who shall be responsible for monitoring and verifying
          compliance with all contractual obligations set forth herein.
        </Text>

        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE EIGHTEEN – ENTIRE AGREEMENT:
        </Text>
        <Text style={styles.paragraph}>
          This Agreement supersedes and replaces any prior verbal or written
          agreements, understandings, or arrangements entered into between the
          Parties with respect to its subject matter.
        </Text>
        <Text style={[styles.bold, { marginTop: 6 }]}>
          CLAUSE NINETEEN – AMENDMENTS:
        </Text>
        <Text style={styles.paragraph}>
          This Agreement may be amended, modified, or supplemented only by a
          written instrument duly executed and signed by both Parties. For all
          legal purposes, the Parties establish their contractual domicile in
          the State of Florida, United States of America.
        </Text>

        <Text style={[styles.paragraph, { marginTop: 10 }]}>
          IN WITNESS WHEREOF, having read and understood the contents of this
          Agreement, the Parties execute it electronically on the{" "}
          {dayOf(data.fechaEjecucion)} day of {monthOf(data.fechaEjecucion)},{" "}
          {yearOf(data.fechaEjecucion)}.
        </Text>

        {/* <View style={styles.signatureRow}>
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
            <Text>Identification No.: {data.cedula || "________"}</Text>
          </View>
        </View> */}
      </Page>
    </Document>
  );
};

export default InternationalProfessionalServicesAgreementPDF;
