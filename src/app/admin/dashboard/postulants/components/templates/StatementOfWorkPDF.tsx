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
  logoText: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#0097B2",
    textAlign: "center",
  },
  dateContainer: {
    position: "absolute",
    right: 0,
    top: 15,
  },
  date: {
    fontSize: 11,
    color: "#666666",
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
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    marginTop: 18,
    marginBottom: 8,
    color: "#333333",
  },
  indentedText: {
    marginLeft: 20,
    marginBottom: 8,
    fontStyle: "italic",
  },
  contactSection: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: "#f8f9fa",
    padding: 10,
    borderRadius: 4,
  },
  contactTitle: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    fontSize: 10,
  },
  contactInfo: {
    marginLeft: 15,
    lineHeight: 1.4,
    fontSize: 10,
  },
  bankingSection: {
    backgroundColor: "#f0f8ff",
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
    borderRadius: 4,
  },
  bankingTitle: {
    fontFamily: "Helvetica-Bold",
    marginBottom: 8,
    fontSize: 11,
  },
  bankingInfo: {
    fontSize: 10,
    lineHeight: 1.4,
  },
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 50,
    paddingTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#cccccc",
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
    fontSize: 9,
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
  },
  signatureDate: {
    fontSize: 8,
    textAlign: "center",
    marginTop: 5,
    color: "#666666",
  },
});

interface StatementOfWorkData {
  fechaEjecucion: string;
  nombreCompleto: string;
  fechaInicioLabores: string;
  descripcionServicios: string;
  correoElectronico: string;
  salarioProbatorio: string;
  ofertaSalarial: string;
  monedaSalario: string;
  nombreBanco: string;
  numeroCuenta: string;
  direccionCompleta: string;
  telefono: string;
  cedula: string;
}

interface StatementOfWorkPDFProps {
  data: StatementOfWorkData;
}

const StatementOfWorkPDF: React.FC<StatementOfWorkPDFProps> = ({ data }) => {
  const formatDateWithOrdinal = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const day = date.getDate();
      const month = date.toLocaleDateString("en-US", { month: "long" });
      const year = date.getFullYear();

      const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
    } catch {
      return dateString;
    }
  };

  const startDate = formatDateWithOrdinal(data.fechaInicioLabores);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header con logo y fecha */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image src="/images/logo-andes.png" style={styles.logo} />
          </View>
          <View style={styles.dateContainer}>
            <Text style={styles.date}>{data.fechaEjecucion}</Text>
          </View>
        </View>

        {/* STATEMENT OF WORK SECTION */}
        <Text style={styles.title}>STATEMENT OF WORK</Text>

        <Text style={styles.paragraph}>
          This Statement of Work is being executed on {data.fechaEjecucion},
          between Andes Workforce LLC (`&ldquo;Company&rdquo;`) and{" "}
          {data.nombreCompleto} (`&ldquo;Contractor&rdquo;`). This Statement of
          Work describes the Services to be performed and provided by Contractor
          pursuant to the Professional Services Agreement.
        </Text>

        <Text style={styles.sectionTitle}>Term</Text>
        <Text style={styles.paragraph}>
          Contractor agrees to provide administrative services as further
          detailed below (`&ldquo;Services&rdquo;`) to Company beginning on{" "}
          {startDate} (`&ldquo;Start Date&rdquo;`) and continuing until it
          expires or is terminated by Company or Contractor.
        </Text>

        <Text style={styles.sectionTitle}>Services</Text>
        <Text style={styles.paragraph}>
          The Contractor will provide the following Services:
        </Text>
        <Text style={styles.paragraph}>{data.descripcionServicios}</Text>

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

        {/* Información de contacto */}
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact person (Company):</Text>
          <View style={styles.contactInfo}>
            <Text>Miguel Rendon</Text>
            <Text>info@andes-workforce.com</Text>
            <Text>(`&ldquo; Key Company Contac&rdquo;`)</Text>
          </View>
        </View>

        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>Contact person (Contractor):</Text>
          <View style={styles.contactInfo}>
            <Text>{data.nombreCompleto}</Text>
            <Text>{data.correoElectronico}</Text>
            <Text>(`&ldquo; Key Contractor Contac&rdquo;`)</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Service Fee</Text>
        <Text style={styles.paragraph}>
          As of the Start Date, Contractor will be paid a fee of{" "}
          {data.monedaSalario} {data.salarioProbatorio} fixed per month during a
          3-month probationary period. Starting the first day of the month
          following the probationary period, Contractor will be paid a fee of{" "}
          {data.monedaSalario} {data.ofertaSalarial} fixed per month, inclusive
          of all taxes (howsoever described) (`&ldquo;Service Fee&rdquo;`).
        </Text>

        <Text style={styles.paragraph}>
          Payment of the Service Fee to Contractor will be initiated on the last
          day of the month. This Service Fee will be increased by 5% annually.
          Contractor will receive double pay when required to work during a
          local holiday in his or her country of residence.
        </Text>

        <Text style={styles.paragraph}>
          Additionally, Contractor will receive a 2-week holiday bonus at the
          end of each calendar year. The holiday bonus will be prorated for
          Contractors who have completed less than 6 months of work at the end
          of the calendar year.
        </Text>

        <Text style={styles.paragraph}>
          Contractor will receive payment via direct deposit to the bank account
          below:
        </Text>

        {/* Información bancaria */}
        <View style={styles.bankingSection}>
          <Text style={styles.bankingTitle}>Banking Information:</Text>
          <View style={styles.bankingInfo}>
            <Text>
              Name of Bank: {data.nombreBanco || "____________________"}
            </Text>
            <Text>
              Account Number: {data.numeroCuenta || "____________________"}
            </Text>
            <Text>Account holder name: {data.nombreCompleto}</Text>
            <Text>
              Account holder address:{" "}
              {data.direccionCompleta || "____________________"}
            </Text>
            <Text>
              Telephone number: {data.telefono || "____________________"}
            </Text>
            <Text>
              Government ID Number: {data.cedula || "____________________"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Independent Contractor Relationship
        </Text>
        <Text style={styles.paragraph}>
          Company and Contractor acknowledge and agree that Contractor is not an
          employee and expressly state that the Services covered by this
          Statement of Work shall be rendered independently by Contractor, and
          that the contractual relationship does not and will not create an
          employer-employee relationship.
        </Text>

        <Text style={styles.sectionTitle}>Termination</Text>
        <Text style={styles.paragraph}>
          This Statement of Work will end upon the completion of Services, as
          reasonably determined by the Company, or on the last date practicable
          after the Start Date in accordance with applicable law, unless
          extended by the parties in writing.
        </Text>

        <Text style={styles.paragraph}>
          During the 3-month probationary period, either party may terminate
          this Statement of Work without cause, upon at least 2 days written
          notice to the other Party. After completion of the 3-month
          probationary period, the Company requires a two-week notice to
          terminate this Statement of Work.
        </Text>

        <Text style={styles.sectionTitle}>Paid Time Off (PTO)</Text>
        <Text style={styles.paragraph}>
          Contractor will accrue 15 PTO days per calendar year. Contractor will
          request PTO via email from Company ahead of time and, once approved,
          Company will notify contractor with an updated PTO balance. PTO is not
          authorized during initial 3-month probationary period.
        </Text>

        {/* Título */}
        <Text style={styles.title}>PROFESSIONAL SERVICES AGREEMENT</Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>EFFECTIVE DATE:</Text>{" "}
          {data.fechaEjecucion}
        </Text>

        {/* Contenido principal */}
        <Text style={styles.paragraph}>
          This Professional Services Agreement (this `&ldquo; Agreemen&rdquo;` )
          is made by an between: Andes Workforce LLC, registered in the United
          States under Limited Liability Company Registration No. L24000192685
          having its principal place of business in Florida, United States,
          (`&ldquo;Company&rdquo;`).
        </Text>

        <Text style={styles.paragraph}>And</Text>

        <Text style={styles.paragraph}>
          {data.nombreCompleto}, having its principal place of business at
          address,
          {data.direccionCompleta}, (`&ldquo; Contractor&rdquo;`).
        </Text>

        <Text style={styles.paragraph}>
          Company and Contractor (each referred to as `&ldquo; Part&rdquo;` an d
          referred t together as `&ldquo;Parties&rdquo;`) wish to enter into an
          Agreement for the Contractor to provide services to Company, according
          to the terms, conditions, and provisions set forth below, along with
          any Statements of Work.
        </Text>

        <Text style={styles.sectionTitle}>SERVICE OBLIGATIONS</Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            1. Statements of Work.
          </Text>{" "}
          During the term of this Agreement, Company and Contractor may execute
          one or more statements of work detailing the specific services to be
          performed by Contractor (as executed, a `&ldquo; Statement of
          Work(s)&rdquo;`). Each Statement of Work will expressly refer to this
          Agreement, will form a part of this Agreement, and will be subject to
          the terms and conditions contained herein. A Statement of Work may be
          amended only by a signed (by each party`&ldquo;s authorized signatory)
          and written agreement of the parties.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            2. Confidential Information and Intellectual Property Assignment
            Agreement:
          </Text>{" "}
          Contractor shall sign, or has signed, a Confidential Information and
          Intellectual Property Assignment Agreement in the form set forth as
          Exhibit A hereto, on or before the date Contractor begins providing
          the Services.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            3. Personal Performance Required:
          </Text>{" "}
          Contractor shall promote the interests of the Company and, unless
          prevented by ill health or accident, devote as much time as is
          necessary for the performance of your obligations under this
          Agreement. Where personal performance by Contractor is required, if
          Contractor is unable to provide the Services due to illness or injury,
          Contractor shall notify Company as soon as reasonably practicable. For
          the avoidance of doubt, no fee shall be payable for Services which are
          not provided.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            4. Geographic Restrictions:
          </Text>{" "}
          Under no circumstances may you perform work for Andes Workforce LLC
          and its Client(s) while in any U.S. territory whatsoever. In case of
          travel by You to the United States or any of its territories, you must
          take time off (paid or unpaid) and cease any work duties whatsoever.
        </Text>

        <Text style={styles.sectionTitle}>PAYMENT OBLIGATIONS</Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>5. Fees.</Text> As
          compensation for the Services provided by Contractor, Company shall
          pay Contractor the amounts specified in each Statement of Work in
          accordance with the terms set forth therein. Contractor acknowledges
          and agrees that Company`&ldquo;s payment obligation will be expressly
          subject to Contractor`&ldquo;s completion of specified Services and/or
          achievement of milestones to Company`&ldquo;s reasonable satisfaction.
        </Text>

        <Text style={styles.sectionTitle}>WARRANTIES AND DISCLAIMERS</Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            6. No Employment Relationship.
          </Text>{" "}
          Under the terms of this Agreement, Contractor`&ldquo;s relationship
          with Company will be that of an independent contractor providing
          Services to Company, and not that of an employee, worker, agent, or
          partner of Company. The Parties expressly state that Contractor is an
          independent service provider who will provide services on a fee basis
          without subordination and dependence on the Company, thus creating a
          civil relationship between them and never an employment relationship.
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

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>7. No Authority.</Text>{" "}
          Contractor is NOT an agent of Company and cannot bind Company in any
          contracts or other obligations. Contractor will not hold itself out as
          being an employee, agent, partner or assignee of Company, as having
          any authority to bind Company or to incur any liability on behalf of
          Company and will make such absence of authority clear in its dealings
          with any third parties.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>8. Insurance.</Text>{" "}
          Contractor certifies that it is currently insured and will maintain in
          force suitable insurance policies. Contractor acknowledges that
          Company will not carry any liability insurance on behalf of
          Contractor. Contractor will provide promptly copies of such insurance
          obtained on reasonable request.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>9. No Conflicts.</Text>{" "}
          Contractor represents and warrants that Contractor is not under any
          pre-existing obligation or commitments (and will not assume or
          otherwise undertake any obligations or commitments) in conflict or in
          any way inconsistent with the provisions of this Agreement. Contractor
          represents and warrants that Contractor`&ldquo;s performance of all
          the terms of this Agreement will not breach any agreement to keep in
          confidence proprietary information acquired by Contractor in
          confidence or in trust prior to commencement of this Agreement.
          Contractor warrants that Contractor has the right to disclose and/or
          or use all ideas, processes, techniques, and other information, if
          any, which Contractor has gained from third parties, and which
          Contractor discloses to the Company or uses during performance of this
          Agreement, without liability to such third parties.
        </Text>

        <Text style={styles.paragraph}>
          Notwithstanding the foregoing, Contractor agrees that Contractor shall
          not bundle with or incorporate into any deliveries provided to the
          Company herewith any third-party products, ideas, processes, or other
          techniques, without the express, written prior approval of the
          Company. Contractor represents and warrants that Contractor has not
          granted and will not grant any rights or licenses to any intellectual
          property or technology that would conflict with Contractor`&ldquo;s
          obligations under this Agreement. Contractor will not knowingly
          infringe upon any copyright, patent, trade secret or other property
          right of any former client, employer or third party in the performance
          of the Services.
        </Text>

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            10. Entire Agreement.
          </Text>{" "}
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

        <Text style={styles.paragraph}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>
            11. Authority to Bind.
          </Text>{" "}
          Signatories below represent and warrant that they have full power and
          authority to enter into the Agreement and to fulfill all its terms and
          conditions. This Agreement may be executed electronically, by
          facsimile, and in counterparts.
        </Text>

        <Text style={styles.paragraph}>
          By signing below Company and Contractor agree to the above terms, and
          any other attached addendum and referenced Statements of Work.
        </Text>

        {/* CONFIDENTIALITY AND INTELLECTUAL PROPERTY AGREEMENT */}
        <Text style={styles.title}>
          Confidentiality and Intellectual Property Agreement
        </Text>

        <Text style={styles.paragraph}>
          This Confidentiality and Intellectual Property Agreement
          (`&ldquo;CIPA&rdquo;` ) is intended to set clear expectations
          regarding confidentiality and intellectual property between{" "}
          {data.nombreCompleto} (`&ldquo;Contractor&rdquo;` ) and Andes
          Workforce LLC, including its parent companies, subsidiaries, and
          affiliates (`&ldquo;Customer&rdquo;`). Contractor and Customer may be
          referred to collectively as the Parties or individually as a Party.
        </Text>

        <Text style={styles.sectionTitle}>Consideration</Text>
        <Text style={styles.paragraph}>
          The Parties acknowledge and agree that this CIPA is not an employment
          contract, and it does not purport to set forth all of the terms and
          conditions of Contractor`&ldquo;s engagement with Customer, which is
          governed by separate agreement(s) and the legislation of
          Contractor`&ldquo;s home country. If, however, there are any
          inconsistent terms between this CIPA and any other agreement(s)
          between the Parties related to the subject matter herein, the terms of
          this CIPA control. The terms of this CIPA can only be changed by a
          subsequent, written agreement signed by the Parties. Contractor
          understands and acknowledges that this CIPA is and has been a material
          part of the consideration for Contractor`&ldquo;s engagement with
          Customer.
        </Text>

        <Text style={styles.paragraph}>
          Contractor has not entered into, and agrees not to enter into, any
          agreement (either written or oral) in conflict with this CIPA or
          Contractor`&ldquo;s engagement with Customer. Contractor agrees not to
          (a) violate any agreement with or rights of any third party, or (b)
          use or disclose Contractor`&ldquo;s own or any third party`&ldquo;s
          confidential information or intellectual property (as detailed in the
          paragraph `&ldquo;Open-Source and Third-Party Components,&rdquo;`
          below) (i) when acting within the scope of Contractor`&ldquo;s
          engagement, or (ii) on behalf of Customer, except as expressly
          authorized in writing herein. Further, Contractor represents that
          Contractor has not retained anything containing any confidential
          information of a prior employer or other third party, whether or not
          created by Contractor.
        </Text>

        <Text style={styles.sectionTitle}>Confidentiality</Text>
        <Text style={styles.paragraph}>
          In discussions and activities surrounding Contractor`&ldquo;s work,
          sales, products, technology, and models that Customer may use or
          develop, Contractor may obtain, or may already have obtained,
          Confidential Information about Customer`&ldquo;s business. This CIPA
          prevents unauthorized use or disclosure of Confidential Information.
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
          confidential.
        </Text>

        <Text style={styles.paragraph}>
          For purposes of this CIPA, the term trade secrets has its ordinary
          meaning under applicable law but includes, without limitation, any
          information that is: (a) commercially valuable because it is secret,
          (b) known only to a limited group of persons; and (c) subject to
          reasonable steps taken by the owner of such information to keep it
          secret. Confidential Information does not include information that is
          (a) previously known on a nonconfidential basis by the Contractor, (b)
          in the public domain through no fault of the Contractor, (c) received
          from a person other than any of the other Parties or their respective
          representatives or agents, so long as such other person was not, to
          the best knowledge of the Contractor, subject to a duty of
          confidentiality to Customer, (d) developed independently by the
          Contractor without reference to Confidential Information, or (e)
          specifically allowed for disclosure by Customer in a written release.
          If the information becomes public because of Contractor`&ldquo;s
          violation of this CIPA, it is still deemed Confidential Information
          and protected by this CIPA.
        </Text>

        <Text style={styles.paragraph}>
          Contractor agrees to keep the Confidential Information confidential
          and to exercise reasonable care to protect the confidentiality of
          Confidential Information. Reasonable care means at least the same
          level of care that Contractor would reasonably use to protect
          Contractor`&ldquo;s own confidential information. As part of such
          reasonable care, Contractor may not allow anyone else to access
          Customer`&ldquo;s tools or computer access passwords without
          Customer`&ldquo;s written approval. Contractor agrees not to disclose
          Customer`&ldquo;s Confidential Information to any third party and to
          only use the Confidential Information for the purposes of
          Contractor`&ldquo;s relationship with Customer.
        </Text>

        <Text style={styles.sectionTitle}>Intellectual Property</Text>
        <Text style={styles.paragraph}>
          For purposes of this CIPA, the term `&ldquo;IP Rights&rdquo;` includes
          but is not necessarily limited to patents, rights to inventions,
          utility model rights, trade marks, business names and domain names,
          rights in get-up and trade dress, design rights, semiconductor
          topography rights, integrated circuit topography rights, plant variety
          rights, database rights, copyright and related rights (including all
          rights of paternity, integrity, disclosure, and withdrawal, and any
          other rights that may be known as or referred to as `&ldquo;moral
          rights,&rdquo;` `&ldquo;artist`&ldquo;s rights,&rdquo;` `&ldquo;droit
          moral,&rdquo;` or the like (collectively `&ldquo;Moral
          Rights&rdquo;`)), mask work rights, rights in goodwill and the right
          to sue for passing off or unfair competition, rights to use, and
          protect the confidentiality of, Confidential Information (including
          knowhow and trade secrets) and all other intellectual property rights
          of any kind, whether registered or unregistered, including all
          applications and rights to apply for and be granted, renewals or
          extensions of, and rights to claim priority from, registrations, and
          all similar or equivalent rights that exist or will exist in any part
          of the world.
        </Text>

        <Text style={styles.sectionTitle}>
          Transfer and Assignment of Ownership Rights
        </Text>
        <Text style={styles.paragraph}>
          For purposes of any assignment, transfer, or licensing of any IP
          Rights contemplated herein, to the extent required by applicable law,
          the term `&ldquo;Customer&rdquo;` refers to the Customer indicated in
          the preamble of this CIPA, exclusive of any parent companies,
          subsidiaries, or affiliates.
        </Text>

        <Text style={styles.paragraph}>
          To the fullest extent allowed by applicable law and by operation
          thereof, Customer owns all Works and IP Rights in and relating to any
          and all Works (which the Parties agree are works made for hire or the
          equivalent under applicable law) made or conceived or reduced to
          practice, in whole or in part, by Contractor (a) at Customer`&ldquo;s
          request or (b) within the scope of and during the term of
          Contractor`&ldquo;s engagement with Customer (collectively,
          `&ldquo;Resulting IP,&rdquo;` the IP Rights to which are collectively
          referred to as the `&ldquo;Resulting IP Rights&rdquo;`). To the extent
          there are any Resulting IP Rights that Customer does not or cannot
          obtain by operation of and under applicable law, Contractor hereby
          permanently and irrevocably assigns to Customer all Resulting IP
          Rights. Such Resulting IP Rights are transferred and/or assigned to
          Customer in full, from the moment of creation.
        </Text>

        <Text style={styles.sectionTitle}>General Terms</Text>
        <Text style={styles.paragraph}>
          Contractor`&ldquo;s confidentiality and cooperation obligations under
          this CIPA remain in effect after termination of Contractor`&ldquo;s
          engagement with Customer, regardless of the reason or reasons for
          termination of such engagement. Customer is entitled to disclose
          Contractor`&ldquo;s obligations under this CIPA to any future employer
          or potential employer of Contractor. To the extent applicable, the
          obligations set forth herein are also binding on Contractor`&ldquo;s
          heirs, executors, assigns, and administrators for the benefit of
          Customer and its subsidiaries, successors, and assigns.
        </Text>

        <Text style={styles.paragraph}>
          At the end of Contractor`&ldquo;s engagement with Customer, and no
          later than within thirty days of Customer`&ldquo;s request, Contractor
          must return all materials, documents and any copies or reproductions
          (hard copy or electronic), extracts, summaries or analyses of
          Confidential Information in any medium or format in
          Contractor`&ldquo;s possession, custody, or control containing,
          reflecting, incorporating (in whole or in part) Confidential
          Information and provide certification that all electronic Confidential
          Information in Contractor`&ldquo;s possession has been destroyed.
        </Text>

        <Text style={styles.sectionTitle}>Additional Legal Provisions</Text>
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
      </Page>
    </Document>
  );
};

export default StatementOfWorkPDF;
