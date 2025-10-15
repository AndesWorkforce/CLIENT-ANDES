import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Estilos para el PDF - usando solo fuentes seguras
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
  header: {
    alignItems: "center",
    marginBottom: 20,
    position: "relative",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  logo: {
    width: 120,
    height: 60,
  },
  title: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 25,
    marginTop: 15,
    color: "#333333",
  },
  paragraph: {
    marginBottom: 12,
    textAlign: "justify",
    lineHeight: 1.5,
  },
  clauseTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginTop: 15,
    marginBottom: 8,
    color: "#333333",
  },
  listItem: {
    marginLeft: 15,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  underline: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
    minWidth: 100,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    paddingTop: 30,
  },
  signatureBlock: {
    width: "40%",
    alignItems: "center",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    width: "100%",
    height: 30,
    marginBottom: 8,
  },
  signatureLabel: {
    fontSize: 11,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  bold: {
    fontFamily: "Helvetica-Bold",
  },
  contactSection: {
    marginTop: 15,
    marginBottom: 15,
  },
});

interface StatementOfWorkEnglishData {
  fechaEjecucion: string;
  nombreCompleto: string;
  fechaInicioLabores: string;
  descripcionServicios: string;
  correoElectronico: string;
  salarioProbatorio: string;
  ofertaSalarial: string;
  monedaSalario: string;
  telefono: string;
  cedula: string;
  nacionalidad?: string;
  direccionCompleta?: string;
  puestoTrabajo?: string;
  nombreBanco?: string;
  numeroCuenta?: string;
  serviceFeeParagraph?: string;
}

interface StatementOfWorkEnglishPDFProps {
  data: StatementOfWorkEnglishData;
}

const StatementOfWorkEnglishPDF: React.FC<StatementOfWorkEnglishPDFProps> = ({
  data,
}) => {
  // Defensive: sanitize Service Fee paragraphs to avoid runtime errors when empty/invalid
  const getServiceFeeParagraphs = (input?: string) => {
    if (typeof input !== "string") return null;
    // Normalize newlines and trim
    const normalized = input
      .replace(/\r/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
    if (!normalized) return null;
    const parts = normalized
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
    return parts.length > 0 ? parts : null;
  };
  // Unified date format: MM/DD/YYYY (US numeric) to keep consistency across templates.
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    // Already canonical? (MM/DD/YYYY) - disambiguate
    const canonical = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (canonical) {
      const [, mm, dd, yyyy] = canonical;
      if (parseInt(dd, 10) > 12 && parseInt(mm, 10) <= 12) {
        // Looks like legacy DD/MM/YYYY actually (day > 12). We'll treat incoming as DD/MM/YYYY and convert.
        return `${dd}/${mm}/${yyyy}`; // will get corrected by logic below if needed
      }
      return `${mm}/${dd}/${yyyy}`; // ensure padding
    }
    // Legacy DD/MM/YY
    const ddmmyy = dateString.match(/^(\d{2})\/(\d{2})\/(\d{2})$/);
    if (ddmmyy) {
      const [, dd, mm, yy] = ddmmyy;
      return `${mm}/${dd}/20${yy}`;
    }
    // Legacy DD/MM/YYYY (only flip when day > 12)
    const ddmmyyyy = dateString.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, dd, mm, yyyy] = ddmmyyyy;
      if (parseInt(dd, 10) > 12) {
        return `${mm}/${dd}/${yyyy}`;
      }
      // ambiguous (<=12) treat as already canonical order mm/dd
      return `${dd}/${mm}/${yyyy}`;
    }
    // ISO
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      const [y, m, d] = dateString.split("-").map(Number);
      return `${String(m).padStart(2, "0")}/${String(d).padStart(2, "0")}/${y}`;
    }
    const parsed = new Date(dateString);
    if (!isNaN(parsed.getTime())) {
      const m = String(parsed.getMonth() + 1).padStart(2, "0");
      const d = String(parsed.getDate()).padStart(2, "0");
      const y = parsed.getFullYear();
      return `${m}/${d}/${y}`;
    }
    return dateString;
  };

  return (
    <Document>
      {/* Página 1: Statement of Work */}
      <Page size="A4" style={styles.page}>
        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/images/logo-andes.png" style={styles.logo} />
          </View>
        </View>

        {/* Título principal */}
        <Text style={styles.title}>STATEMENT OF WORK</Text>

        {/* Introducción */}
        <Text style={styles.paragraph}>
          This Statement of Work is being executed on{" "}
          <Text style={styles.underline}>
            {data.fechaEjecucion
              ? formatDate(data.fechaEjecucion)
              : "_____________"}
          </Text>
          , between Andes Workforce LLC (&quot;Company&quot;) and{" "}
          <Text style={styles.underline}>
            {data.nombreCompleto || "__________________________"}
          </Text>{" "}
          (&quot;Contractor&quot;). This Statement of Work describes the
          Services to be performed and provided by Contractor pursuant to the
          Professional Services Agreement.
        </Text>

        {/* Term */}
        <Text style={styles.clauseTitle}>Term</Text>
        <Text style={styles.paragraph}>
          Contractor agrees to provide{" "}
          <Text style={styles.underline}>
            {data.puestoTrabajo || "____________________"}
          </Text>{" "}
          services as further detailed below (&quot;Services&quot;) to Company
          beginning on{" "}
          <Text style={styles.underline}>
            {data.fechaInicioLabores || "_____________"}
          </Text>{" "}
          (&quot;Start Date&quot;) and continuing until it expires or is
          terminated by Company or Contractor.
        </Text>

        {/* Services */}
        <Text style={styles.clauseTitle}>Services</Text>
        <Text style={styles.paragraph}>
          The Contractor will provide the following Services:
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.underline}>
            {data.descripcionServicios ||
              "______________________________________________________________________________"}
          </Text>
        </Text>

        {/* Description of workflow */}
        <Text style={styles.clauseTitle}>Description of workflow</Text>
        <Text style={styles.paragraph}>
          Contractor shall devote the necessary time for the performance of
          Services, in accordance with the Professional Services Agreement.
          Contractor can determine their place of work and equipment to be used
          subject to the terms agreed with Company.
        </Text>

        <Text style={styles.paragraph}>
          In connection with this Statement of Work, the parties may reach out
          to each other as follows:
        </Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Contact person (Company):</Text>
        </Text>
        <Text style={styles.paragraph}>Miguel Rendon</Text>
        <Text style={styles.paragraph}>info@andes-workforce.com</Text>
        <Text style={styles.paragraph}>(&quot;Key Company Contact&quot;)</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.bold}>Contact person (Contractor):</Text>
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.underline}>
            {data.nombreCompleto || "_________________________"}
          </Text>
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.underline}>
            {data.correoElectronico || "_________________________"}
          </Text>
        </Text>
        <Text style={styles.paragraph}>
          (&quot;Key Contractor Contact&quot;)
        </Text>

        {/* Service Fee */}
        <Text style={styles.clauseTitle}>Service Fee</Text>
        {(() => {
          const feeParas = getServiceFeeParagraphs(data.serviceFeeParagraph);
          if (feeParas) {
            return feeParas.map((p: string, idx: number) => (
              <Text style={styles.paragraph} key={idx}>
                {p}
              </Text>
            ));
          }
          // Strong fallback: render a single safe line prompting completion instead of complex block
          return (
            <Text style={styles.paragraph}>
              Please provide the Service Fee terms for this contract (e.g.,
              probationary monthly fee, post-probation monthly fee, payment
              date, and annual increase). If left blank, this section will
              remain pending completion.
            </Text>
          );
        })()}

        <Text style={styles.paragraph}>
          Contractor will receive payment via direct deposit to the account
          listed in the contractor’s profile.
        </Text>

        {/* Independent Contractor Relationship */}
        <Text style={styles.clauseTitle}>
          Independent Contractor Relationship
        </Text>
        <Text style={styles.paragraph}>
          Company and Contractor acknowledge and agree that Contractor is not an
          employee and expressly state that the Services covered by this
          Statement of Work shall be rendered independently by Contractor, and
          that the contractual relationship does not and will not create an
          employer-employee relationship. This declaration constitutes an
          essential element of this Agreement and a fundamental cause that the
          Parties, and especially the Company, have had for its execution.
        </Text>

        {/* Termination */}
        <Text style={styles.clauseTitle}>Termination</Text>
        <Text style={styles.paragraph}>
          This Statement of Work will end upon the completion of Services, as
          reasonably determined by the Company, or on the last date practicable
          after the Start Date in accordance with applicable law, unless
          extended by the parties in writing. Additional Statements of Work may
          be entered into upon mutual agreement of the Parties.
        </Text>

        <Text style={styles.paragraph}>
          The Company requires a two-week notice to terminate this Statement of
          Work. In the event of separation from the company, whether voluntary
          or involuntary, the contractor shall ensure a proper turnover of all
          duties and responsibilities to other employees, including any and all
          company records, documents, properties, equipment and other materials
          in possession and custody of contractor.
        </Text>
      </Page>

      {/* Página 2: Professional Services Agreement */}
      <Page size="A4" style={styles.page}>
        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/images/logo-andes.png" style={styles.logo} />
          </View>
        </View>

        {/* Título y encabezado alineados como en el diseño */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginBottom: 10,
          }}
        >
          <View>
            <Text style={[styles.bold, { fontSize: 14 }]}>
              PROFESSIONAL SERVICES AGREEMENT
            </Text>
            <Text style={[styles.bold, { fontSize: 12, marginTop: 8 }]}>
              EFFECTIVE DATE:{" "}
              <Text style={styles.underline}>
                {data.fechaEjecucion
                  ? formatDate(data.fechaEjecucion)
                  : "_____________"}
              </Text>
            </Text>
          </View>
        </View>

        <Text style={styles.paragraph}>
          This Professional Services Agreement (this &quot;Agreement&quot;) is
          made by and between:
        </Text>

        <Text style={styles.paragraph}>
          Andes Workforce LLC, registered in the United States under Limited
          Liability Company Registration No. L24000192685 having its principal
          place of business in Florida, United States, (&quot;Company&quot;),
        </Text>

        <Text style={styles.paragraph}>And</Text>

        <Text style={styles.paragraph}>
          <Text style={styles.underline}>
            {data.nombreCompleto || "__________________________"}
          </Text>
          , having its principal place of business at address,
          <Text style={styles.underline}>
            {data.direccionCompleta || "__________________________"}
          </Text>
          , (&quot;Contractor&quot;).
        </Text>

        <Text style={styles.paragraph}>
          Company and Contractor (each referred to as “Party” and referred to
          together as “Parties”) wish to enter into an Agreement for the
          Contractor to provide services to Company, according to the terms,
          conditions, and provisions set forth below, along with any Statements
          of Work.
        </Text>

        <Text style={[styles.bold, { fontSize: 14 }]}>SERVICE OBLIGATIONS</Text>

        <Text style={styles.clauseTitle}>1. Statements of Work.</Text>
        <Text style={styles.paragraph}>
          During the term of this Agreement, Company and Contractor may execute
          one or more statements of work detailing the specific services to be
          performed by Contractor (as executed, a &quot;Statement of
          Work(s)&quot;). Each Statement of Work will expressly refer to this
          Agreement, will form a part of this Agreement, and will be subject to
          the terms and conditions contained herein. A Statement of Work may be
          amended only by a signed (by each party`&apos;s authorized signatory)
          and written agreement of the parties.
        </Text>

        <Text style={styles.clauseTitle}>
          2. Confidential Information and Intellectual Property Assignment
          Agreement:
        </Text>
        <Text style={styles.paragraph}>
          Contractor shall sign, or has signed, a Confidential Information and
          Intellectual Property Assignment Agreement in the form set forth as
          Exhibit A hereto, on or before the date Contractor begins providing
          the Services.
        </Text>

        <Text style={styles.clauseTitle}>
          3. Personal Performance Required:
        </Text>
        <Text style={styles.paragraph}>
          Contractor shall promote the interests of the Company and, unless
          prevented by ill health or accident, devote as much time as is
          necessary for the performance of your obligations under this
          Agreement. Where personal performance by Contractor is required, if
          Contractor is unable to provide the Services due to illness or injury,
          Contractor shall notify Company as soon as reasonably practicable. For
          the avoidance of doubt, no fee shall be payable for Services which are
          not provided.
        </Text>

        <Text style={styles.clauseTitle}>4. Geographic Restrictions:</Text>
        <Text style={styles.paragraph}>
          Under no circumstances may you perform work for Andes Workforce LLC
          and its Client(s) while in any U.S. territory whatsoever. In case of
          travel by You to the United States or any of its territories, you must
          take time off (paid or unpaid) and cease any work duties whatsoever.
        </Text>

        <Text style={[styles.bold, { fontSize: 14 }]}>PAYMENT OBLIGATIONS</Text>

        <Text style={styles.clauseTitle}>5. Fees.</Text>
        <Text style={styles.paragraph}>
          As compensation for the Services provided by Contractor, Company shall
          pay Contractor the amounts specified in each Statement of Work in
          accordance with the terms set forth therein. Contractor acknowledges
          and agrees that Company’s payment obligation will be expressly subject
          to Contractor’s completion of specified Services and/or achievement of
          milestones to Company’s reasonable satisfaction.
        </Text>

        <Text style={[styles.bold, { fontSize: 14 }]}>
          WARRANTIES AND DISCLAIMERS
        </Text>

        <Text style={styles.clauseTitle}>6. No Employment Relationship.</Text>
        <Text style={styles.paragraph}>
          Under the terms of this Agreement, Contractor’s relationship with
          Company will be that of an independent contractor providing Services
          to Company, and not that of an employee, worker, agent, or partner of
          Company. The Parties expressly state that Contractor is an independent
          service provider who will provide services on a fee basis without
          subordination and dependence on the Company, thus creating a civil
          relationship between them and never an employment relationship.
          Consequently, Contractor shall not be considered in any way as an
          employee of the Company, which shall not be subject to any labor or
          social security obligation whatsoever with respect to him/her.
          Contractor will not be entitled to any Company entitlements or
          statutory benefits payable to employees or workers by law. To the
          extent requested by Company or required by applicable law, Contractor
          will provide Company with all documents to authenticate or validate
          this business-to-business relationship. Where required by applicable
          law, Contractor will undertake all required registrations and/or
          licenses with government or taxation agencies as an independent
          contractor or separate entity from Company.
        </Text>

        <Text style={styles.clauseTitle}>7. No Authority.</Text>
        <Text style={styles.paragraph}>
          Contractor is NOT an agent of Company and cannot bind Company in any
          contracts or other obligations. Contractor will not hold itself out as
          being an employee, agent, partner or assignee of Company, as having
          any authority to bind Company or to incur any liability on behalf of
          Company and will make such absence of authority clear in its dealings
          with any third parties.
        </Text>

        <Text style={styles.clauseTitle}>8. Insurance.</Text>
        <Text style={styles.paragraph}>
          Contractor certifies that it is currently insured and will maintain in
          force suitable insurance policies. Contractor acknowledges that
          Company will not carry any liability insurance on behalf of
          Contractor. Contractor will provide promptly copies of such insurance
          obtained on reasonable request.
        </Text>

        <Text style={styles.clauseTitle}>9. No Conflicts.</Text>
        <Text style={styles.paragraph}>
          Contractor represents and warrants that Contractor is not under any
          pre-existing obligation or commitments (and will not assume or
          otherwise undertake any obligations or commitments) in conflict or in
          any way inconsistent with the provisions of this Agreement. Contractor
          represents and warrants that Contractor’s performance of all the terms
          of this Agreement will not breach any agreement to keep in confidence
          proprietary information acquired by Contractor in confidence or in
          trust prior to commencement of this Agreement. Contractor warrants
          that Contractor has the right to disclose and/or or use all ideas,
          processes, techniques, and other information, if any, which Contractor
          has gained from third parties, and which Contractor discloses to the
          Company or uses during performance of this Agreement, without
          liability to such third parties. Notwithstanding the foregoing,
          Contractor agrees that Contractor shall not bundle with or incorporate
          into any deliveries provided to the Company herewith any third-party
          products, ideas, processes, or other techniques, without the express,
          written prior approval of the Company. Contractor represents and
          warrants that Contractor has not granted and will not grant any rights
          or licenses to any intellectual property or technology that would
          conflict with Contractor’s obligations under this Agreement.
          Contractor will not knowingly infringe upon any copyright, patent,
          trade secret or other property right of any former client, employer or
          third party in the performance of the Services.
        </Text>
        <Text style={styles.clauseTitle}>10. Entire Agreement.</Text>
        <Text style={styles.paragraph}>
          This Agreement, together with any addenda, and all duly executed
          Statements of Work, constitutes the entire Agreement between Company
          and Contractor, and supersedes all prior understandings and
          agreements. To the extent of any conflict between this Agreement and
          any other agreement between the Parties, this Agreement shall
          supersede such other agreement to the extent of such conflict except
          if such other agreement explicitly states otherwise. Handwritten
          changes to this Agreement are unenforceable. Any change or waiver of
          any provision of this Agreement must be in writing and signed by the
          parties hereto. Each party agrees that it will have no claim for
          innocent or negligent misrepresentation based on any provision of this
          Agreement.
        </Text>

        <Text style={styles.clauseTitle}>11. Authority to Bind.</Text>
        <Text style={styles.paragraph}>
          Signatories below represent and warrant that they have full power and
          authority to enter into the Agreement and to fulfill all its terms and
          conditions. This Agreement may be executed electronically, by
          facsimile, and in counterparts.
        </Text>

        <Text style={styles.paragraph}>
          By signing below Company and Contractor agree to the above terms, and
          any other attached addendum and referenced Statements of Work.
        </Text>
      </Page>

      {/* Página 3: Confidentiality Agreement */}
      <Page size="A4" style={styles.page}>
        {/* Header con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/images/logo-andes.png" style={styles.logo} />
          </View>
        </View>

        {/* Título */}
        <Text style={styles.title}>
          Confidentiality and Intellectual Property Agreement
        </Text>

        <Text style={styles.paragraph}>
          This Confidentiality and Intellectual Property Agreement
          (&quot;CIPA&quot;) is intended to set clear expectations regarding
          confidentiality and intellectual property between{" "}
          <Text style={styles.underline}>
            {data.nombreCompleto || "__________________________"}
          </Text>
          , (&quot;Contractor&quot;) and Andes Workforce LLC, including its
          parent companies, subsidiaries, and affiliates (“Customer”).
          Contractor and Customer may be referred to collectively as the Parties
          or individually as a Party.
        </Text>

        <Text style={styles.clauseTitle}>Consideration</Text>
        <Text style={styles.paragraph}>
          The Parties acknowledge and agree that this CIPA is not an employment
          contract, and it does not purport to set forth all of the terms and
          conditions of Contractor’s engagement with Customer, which is governed
          by separate agreement(s) and the legislation of Contractor’s home
          country. If, however, there are any inconsistent terms between this
          CIPA and any other agreement(s) between the Parties related to the
          subject matter herein, the terms of this CIPA control. The terms of
          this CIPA can only be changed by a subsequent, written agreement
          signed by the Parties. Contractor understands and acknowledges that
          this CIPA is and has been a material part of the consideration for
          Contractor’s engagement with Customer.
        </Text>
        <Text style={styles.paragraph}>
          Contractor has not entered into, and agrees not to enter into, any
          agreement (either written or oral) in conflict with this CIPA or
          Contractor’s engagement with Customer. Contractor agrees not to (a)
          violate any agreement with or rights of any third party, or (b) use or
          disclose Contractor’s own or any third party’s confidential
          information or intellectual property (as detailed in the paragraph
          “Open-Source and Third-Party Components,” below) (i) when acting
          within the scope of Contractor’s engagement, or (ii) on behalf of
          Customer, except as expressly authorized in writing herein. Further,
          Contractor represents that Contractor has not retained anything
          containing any confidential information of a prior employer or other
          third party, whether or not created by Contractor.
        </Text>

        <Text style={styles.clauseTitle}>Confidentiality</Text>
        <Text style={styles.paragraph}>
          In discussions and activities surrounding Contractor’s work, sales,
          products, technology, and models that Customer may use or develop,
          Contractor may obtain, or may already have obtained, Confidential
          Information about Customer’s business. This CIPA prevents unauthorized
          use or disclosure of Confidential Information.
        </Text>
        <Text style={styles.paragraph}>
          Confidential Information includes all non-public knowledge, documents,
          information, and data of Customer, which includes but is not limited
          to, customer lists, prices and how they are set, non-public
          intellectual property (including but not limited to trade secrets),
          employee information, business plans, coding, processes, inventions,
          computer-related equipment or technology, applications, operating
          systems, databases and other computer related software technical data,
          new ideas, methods of doing business, any other information received
          in any other form bearing a note on or pointing out the confidential
          nature of such information, any personal information governed by
          applicable data-protection regulations, and any Confidential
          Information that Customer has received (or that may be received in the
          future) from third parties that Customer has agreed to treat as
          confidential. For purposes of this CIPA, the term trade secrets has
          its ordinary meaning under applicable law but includes, without
          limitation, any information that is: (a) commercially valuable because
          it is secret, (b) known only to a limited group of persons; and (c)
          subject to reasonable steps taken by the owner of such information to
          keep it secret. Confidential Information does not include information
          that is (a) previously known on a nonconfidential basis by the
          Contractor, (b) in the public domain through no fault of the
          Contractor, (c) received from a person other than any of the other
          Parties or their respective representatives or agents, so long as such
          other person was not, to the best knowledge of the Contractor, subject
          to a duty of confidentiality to Customer, (d) developed independently
          by the Contractor without reference to Confidential Information, or
          (e) specifically allowed for disclosure by Customer in a written
          release. If the information becomes public because of Contractor’s
          violation of this CIPA, it is still deemed Confidential Information
          and protected by this CIPA.
        </Text>
        <Text style={styles.paragraph}>
          Contractor agrees to keep the Confidential Information confidential
          and to exercise reasonable care to protect the confidentiality of
          Confidential Information. Reasonable care means at least the same
          level of care that Contractor would reasonably use to protect
          Contractor’s own confidential information. As part of such reasonable
          care, Contractor may not allow anyone else to access Customer’s tools
          or computer access passwords without Customer&#39;s written approval.
          Contractor agrees not to disclose Customer’s Confidential Information
          to any third party and to only use the Confidential Information for
          the purposes of Contractor’s relationship with Customer. To that end,
          Contractor may disclose such information to Contractor’s own
          consultants, agents, or advisors as required to fulfill Contractor’s
          engagement with Customer, provided that such representatives (a) are
          under a written obligation to treat the Confidential Information as
          confidential and not to use it other than in the manner and to the
          same extent as set out in this CIPA, or (b) have professional (or
          other) duties of confidentiality. However, Contractor is fully
          responsible and liable for any unauthorized disclosure or use by such
          representatives.
        </Text>
        <Text style={styles.paragraph}>
          Contractor agrees: (a) not to use any Confidential Information in
          competition with Customer; (b) not to use any Confidential Information
          in any way that harms Customer; (c) not to share any Confidential
          Information with Customer’s competitors; (d) not to use any
          Confidential Information for Contractor’s own or any third party’s
          business advantage; and (e) not to reverse engineer, or have reverse
          engineered, any Confidential Information. Some confidential
          information, like trade secrets, intellectual property, and certain
          personally identifiable information, is protected by law. Contractor’s
          legal duty to keep that information confidential and protected in
          accordance with such law is in addition to the obligations under this
          CIPA.
        </Text>
        <Text style={styles.paragraph}>
          Contractor agrees to notify Customer immediately of any unauthorized
          access, disclosure, loss, or misuse of Confidential Information or of
          any other breaches of this CIPA by Contractor or Contractor’s
          representatives (collectively, a “Breach of Confidentiality”).
          Contractor will also use best efforts to immediately contain and
          remedy any such Breach of Confidentiality. Finally, Contractor will
          fully cooperate with Customer in any effort to enforce their
          respective rights related to any such Breach of Confidentiality.
          Contractor agrees that money damages are not a sufficient remedy for
          any breach or threatened breach of this CIPA. Therefore, in addition
          to other remedies available, Customer is entitled to seek injunctive
          relief (including interim relief without notice) or specific
          performance to enforce the terms of the CIPA, and Contractor waives
          any requirement for the securing or posting of any bond or the showing
          of actual monetary damages in connection with such claim. Contractor
          further agrees not to oppose the granting of such relief on the basis
          that Customer has an adequate remedy at law. Should litigation arise
          concerning this CIPA, the prevailing Party will be entitled to its
          reasonable attorneys’ fees and court costs in addition to any other
          relief that may be awarded. Contractor may be required by law, court
          order, regulatory inquiry, or subpoena to disclose Customer’s
          Confidential Information (a “Compelled Disclosure”). If Contractor
          receives a notice of Compelled Disclosure, Contractor must provide
          Customer prompt notice of the same, to the extent allowed by law, and
          must provide reasonable assistance if Customer decides to contest the
          Compelled Disclosure.
        </Text>

        <Text style={styles.clauseTitle}>Intellectual Property</Text>
        <Text style={styles.paragraph}>
          For purposes of this CIPA, the term “IP Rights” includes but is not
          necessarily limited to patents, rights to inventions, utility model
          rights, trade marks, business names and domain names, rights in get-up
          and trade dress, design rights, semiconductor topography rights,
          integrated circuit topography rights, plant variety rights, database
          rights, copyright and related rights (including all rights of
          paternity, integrity, disclosure, and withdrawal, and any other rights
          that may be known as or referred to as “moral rights,” “artist’s
          rights,” “droit moral,” or the like (collectively “Moral Rights”)),
          mask work rights, rights in goodwill and the right to sue for passing
          off or unfair competition, rights to use, and protect the
          confidentiality of, Confidential Information (including knowhow and
          trade secrets) and all other intellectual property rights of any kind,
          whether registered or unregistered, including all applications and
          rights to apply for and be granted, renewals or extensions of, and
          rights to claim priority from, registrations, and all similar or
          equivalent rights that exist or will exist in any part of the world.
          For avoidance of doubt, copyrights under this CIPA include but are not
          necessarily limited to the full rights of reproduction, adaptation
          (including but not limited to the right to create derivative works),
          publication, performance, and display.
        </Text>

        <Text style={styles.clauseTitle}>
          Transfer and Assignment of Ownership Rights.
        </Text>
        <Text style={styles.paragraph}>
          For purposes of any assignment, transfer, or licensing of any IP
          Rights contemplated herein, to the extent required by applicable law,
          the term “Customer” refers to the Customer indicated in the preamble
          of this CIPA, exclusive of any parent companies, subsidiaries, or
          affiliates.
        </Text>
        <Text style={styles.paragraph}>
          To the fullest extent allowed by applicable law and by operation
          thereof, Customer owns all Works and IP Rights in and relating to any
          and all Works (which the Parties agree are works made for hire or the
          equivalent under applicable law) made or conceived or reduced to
          practice, in whole or in part, by Contractor (a) at Customer’s request
          or (b) within the scope of and during the term of Contractor’s
          engagement with Customer (collectively, “Resulting IP,” the IP Rights
          to which are collectively referred to as the “Resulting IP Rights”).
          To the extent there are any Resulting IP Rights that Customer does not
          or cannot obtain by operation of and under applicable law, Contractor
          hereby permanently and irrevocably assigns to Customer all Resulting
          IP Rights. Such Resulting IP Rights are transferred and/or assigned to
          Customer in full, from the moment of creation.
        </Text>

        <Text style={styles.clauseTitle}>General Terms</Text>
        <Text style={styles.paragraph}>
          Contractor&#39;s confidentiality and cooperation obligations under
          this CIPA remain in effect after termination of Contractor&#39;s
          engagement with Customer, regardless of the reason or reasons for
          termination of such engagement. Customer is entitled to disclose
          Contractor&#39;s obligations under this CIPA to any future employer or
          potential employer of Contractor. To the extent applicable, the
          obligations set forth herein are also binding on Contractor&#39;s
          heirs, executors, assigns, and administrators for the benefit of
          Customer and its subsidiaries, successors, and assigns.
        </Text>
        <Text style={styles.paragraph}>
          At the end of Contractor&#39;s engagement with Customer, and no later
          than within thirty days of Customer’s request, Contractor must return
          all materials, documents and any copies or reproductions (hard copy or
          electronic), extracts, summaries or analyses of Confidential
          Information in any medium or format in Contractor&#39;s possession,
          custody, or control containing, reflecting, incorporating (in whole or
          in part) Confidential Information and provide certification that all
          electronic Confidential Information in Contractor’s possession has
          been destroyed.
        </Text>

        <Text style={styles.clauseTitle}>Additional Legal Provisions</Text>
        <Text style={styles.paragraph}>
          If Contractor is in a jurisdiction where any of the above clauses are
          not lawful, require additional consideration, or have been held to be
          unenforceable, such clause is severable, and all other provisions of
          this CIPA will continue in full force and effect.
        </Text>

        <Text style={styles.paragraph}>
          This CIPA is fully assignable and transferable by Customer, but any
          purported assignment or transfer by Contractor is void.
        </Text>

        <Text style={styles.paragraph}>
          Any delay by a Party to enforce any right under this CIPA will not act
          as a waiver of that right or as a waiver of the ability to later
          assert that right. Waiver of any breach will not be a waiver of the
          underlying obligation.
        </Text>

        <Text style={styles.paragraph}>
          The CIPA can only be changed by a written amendment explicitly
          referencing this CIPA that is executed by both Parties.
        </Text>

        <Text style={styles.paragraph}>
          The undersigned represent that they are authorized to enter into the
          CIPA, which may be executed in counterparts. Electronic signatures are
          acceptable.
        </Text>
        <Text style={styles.paragraph}>
          Having read this CIPA carefully and after being provided with a
          reasonable opportunity to obtain independent legal advice regarding
          this CIPA, Contractor understands and accepts the obligations that
          this CIPA imposes on Contractor without reservation. No promises or
          representations have been made to induce Contractor to sign this CIPA.
          Contractor signs this CIPA voluntarily and freely.
        </Text>

        <Text style={styles.paragraph}>
          Agreed, on the dates noted below, by and between:
        </Text>

        {/* Signature section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>COMPANY:</Text>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureLabel}>
              By: Miguel Rendon, Manager
            </Text>
            <Text style={styles.signatureLabel}>Andes Workforce LLC</Text>
          </View>
          <View style={styles.signatureBlock}>
            <Text style={styles.signatureLabel}>CONTRACTOR:</Text>
            <View style={styles.signatureLine}></View>
            <Text style={styles.signatureLabel}>
              {data.nombreCompleto || "____________________________"}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default StatementOfWorkEnglishPDF;
