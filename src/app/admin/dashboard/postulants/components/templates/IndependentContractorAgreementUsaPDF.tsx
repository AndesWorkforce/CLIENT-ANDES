import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
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
    marginBottom: 14,
    textTransform: "uppercase",
  },
  paragraph: { marginBottom: 10, textAlign: "justify", lineHeight: 1.5 },
  listItem: { marginBottom: 8 },
  indent: { marginLeft: 18 },
  bold: { fontFamily: "Helvetica-Bold" },
  underline: { borderBottomWidth: 1, borderBottomColor: "#000" },
  sectionHeading: { fontFamily: "Helvetica-Bold", marginTop: 10 },
});

export type UsaIcaData = {
  nombreCompleto: string;
  correoElectronico?: string;
  cityCountry?: string; // [City, Country]
  fechaEjecucion?: string; // Month D, YYYY or MM/DD/YYYY
  descripcionServicios?: string; // Exhibit A services paragraph
  ofertaSalarial?: string; // USD numeric
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
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) {
    const [, mm, dd, yyyy] = m;
    return new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
  }
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
};

const formatMonthDayYear = (s?: string) => {
  const d = parseMDY(s);
  if (!d) return "Month Day, Year";
  const month = d.toLocaleDateString("en-US", { month: "long" });
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month} ${day}, ${year}`;
};

const IndependentContractorAgreementUsaPDF: React.FC<{ data: UsaIcaData }> = ({
  data,
}) => {
  const servicesDefault =
    "Serve as the first point of contact for new or prospective clients. Responsible for gathering initial case information, verifying basic eligibility, and entering client details into internal systems. Plays a key role in creating a positive first impression and ensuring a smooth onboarding experience for clients, particularly veterans seeking legal assistance.";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src="/images/logo-andes.png" style={styles.logo} />
        </View>
        <Text style={styles.title}>INDEPENDENT CONTRACTOR AGREEMENT</Text>

        <Text style={styles.paragraph}>
          This Independent Contractor Agreement (&quot;Agreement&quot;) is made
          and entered into by and between Andes Workforce LLC
          (&quot;Company&quot;), a Florida Limited Liability Company with
          offices located at 1032 E Brandon Blvd #3524 and{" "}
          <Text style={styles.underline}>
            {data.nombreCompleto || "__________________________"}
          </Text>
          , an independent contractor (hereinafter referred to as
          &quot;Contractor&quot;), with offices located at{" "}
          <Text style={styles.underline}>
            {data.cityCountry || "City, Country"}
          </Text>{" "}
          as of{" "}
          <Text style={styles.underline}>
            {formatMonthDayYear(data.fechaEjecucion)}
          </Text>
          . Both parties intend to create an independent contractor relationship
          under this Agreement. This Agreement contains the entire agreement and
          understanding between the Company and Contractor and supersedes any
          prior or contemporaneous written and oral agreements, representations,
          and warranties between Company and Contractor respecting the subject
          matter herein.
        </Text>

        <Text style={styles.paragraph}>
          In consideration of the covenants and conditions set forth, below,
          Company and Contractor agree as follows:
        </Text>

        <View style={{ marginLeft: 12 }}>
          <Text style={styles.listItem}>
            1. <Text style={styles.bold}>Period/Term of Agreement</Text>
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            Contractor and Company agree and acknowledge that this Agreement
            with continue in effect until either party terminates this Agreement
            upon two (2) weeks&apos; notice to the other party. Termination of
            this Agreement shall not affect the provisions of Section 4 of the
            Agreement on Confidentiality and Ownership, or the provisions of
            Section 5 of this Agreement as to Restrictive Covenants (non-compete
            and non-solicitation provisions), all of which shall survive
            termination. Notwithstanding the foregoing, the following conduct by
            Contractor is grounds for the immediate termination of this
            Agreement: discrimination, sexual or other harassment; fraud; theft
            from the Company; and a violation of Section 4 or 5 of this
            Agreement.
          </Text>

          <Text style={styles.listItem}>
            2.{" "}
            <Text style={styles.bold}>Nature of Services to be Provided</Text>
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            a. <Text style={styles.bold}>Scope of Work.</Text> Contractor is an
            independently established business or individual and desires to
            contract with the Company for the purpose of providing the services
            set forth on the Statement of Work attached here as Exhibit A (the
            &quot;Services&quot;). If Contractor is a business, Contractor
            hereby warrants that it is organized under U.S. law and authorized
            to do business in the United States. If Contractor is an individual,
            Contractor warrants that he/she is legally entitled to work in the
            United States.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            Contractor will perform all necessary tasks in connection with such
            activities, and other tasks as mutually agreed upon with the
            Company. Contractor agrees and acknowledges that Contractor performs
            services under this Agreement as an independent contractor and that
            Contractor is not an employee or agent of the Company. Contractor
            also agrees and acknowledges that Contractor may neither sign nor
            enter into any contract on behalf of the Company, may not obligate
            or bind the Company in any way and has no authority to commit, act
            for or on behalf of the Company, or to bind the Company to any
            obligation or liability. Additionally, Contractor does not have the
            right to use any trademarks, trade names, slogans or logos in which
            the Company has any interest. Nothing in this Agreement shall be
            construed as creating an employer-employee relationship, as a
            guarantee of future engagement, or as a limitation upon the
            Company’s sole discretion to terminate this Agreement at any time
            without cause.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            Contractor shall be responsible for providing Contractor&apos;s own
            transportation in the performance of services. Contractor is also
            responsible for all costs and expenses incurred in the performance
            of services and will not be reimbursed for any such expenses.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            b. <Text style={styles.bold}>Basis of Assignments:</Text> Contractor
            and Company agree and acknowledge that the Contractor retains the
            right to accept or refuse any assignment or projects that the
            Company requests Contractor to undertake.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            c. <Text style={styles.bold}>Time of Performance:</Text> Contractor
            and Company agree and acknowledge that Contractor may perform any
            services according to Contractor’s own schedule, so long as the
            performance is completed lawfully and in a timely manner consistent
            with time limitations set by the Company.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            d. <Text style={styles.bold}>Method of Performance:</Text>{" "}
            Contractor and Company agree and acknowledge that Contractor retains
            the exclusive right to control the manner and means by which
            Contractor performs services under this Agreement. Contractor and
            Company also agree and acknowledge that Contractor may request or
            receive advice from the Company on accomplishing any service under
            this Agreement.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            e. <Text style={styles.bold}>Performance of Other Services:</Text>{" "}
            Company agrees and acknowledges that Contractor retains the right to
            perform the same or similar services for other companies, persons or
            entities as long as: (i) the performance of such services does not
            interfere with the assignments that Contractor has accepted from the
            Company; (ii) the company, person and/or entity for which Contractor
            is performing the same or similar services does not engage in any
            business that is, or provide services that are, competitive with the
            Company; and (iii) Contractor does not violate the confidentiality
            provisions of Section 4 of this Agreement.
          </Text>

          <Text style={styles.listItem}>
            3. <Text style={styles.bold}>Payment for Services</Text>
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (a) <Text style={styles.bold}>Compensation:</Text> In consideration
            of Contractor&apos;s performance of the services as provided herein,
            as an independent contractor, the Company shall pay Contractor
            according to the schedule set forth in the Statement of Work. At the
            end of each month (and no later than one business day into the new
            month), the Contractor must submit a detailed invoice recording all
            time worked during the preceding month. Contractor will be paid for
            services rendered upon receipt of the invoice from Contractor.
            Contractor shall be paid by check, direct bank deposit, or an agreed
            upon analogous method in legal tender on a monthly basis. Contractor
            represents that it will not receive the majority of her or its
            annual compensation from the Company pursuant to this Agreement.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (b) <Text style={styles.bold}>Benefits:</Text> Contractor agrees and
            acknowledges that Company provides Contractor with no employee
            benefits under this Agreement. Contractor also agrees and
            acknowledges that Contractor’s compensation for services performed
            under this Agreement is limited to monetary compensation, and
            excludes benefits including, but not limited to, health insurance,
            pension or retirement benefits, and vacation, sick or personal time.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (c) <Text style={styles.bold}>Taxes:</Text> Contractor agrees and
            acknowledges that the Company will neither withhold nor be held
            liable for withholding any of her federal, state or local taxes,
            including, but not limited to, income taxes, social security,
            workers’ compensation, and unemployment insurance taxes. Contractor
            is solely responsible for all applicable reporting to any federal,
            state or local tax collection agency and agrees to pay any and all
            taxes that Contractor may owe under federal, state, and local laws
            in connection with services Contractor performed and payments
            Contractor received pursuant to this Agreement. Contractor agrees to
            indemnify and hold harmless the Company with respect to any tax
            liability or penalty relating to such payments that are found to be
            the fault of Contractor.
          </Text>

          <Text style={styles.listItem}>
            4. <Text style={styles.bold}>Confidentiality and Ownership</Text>
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            In connection with the performance of the services hereunder,
            Contractor acknowledges that Contractor will have access to
            Confidential Information regarding the Company. Confidential
            Information shall include, without limitation: client or customer
            lists; client or customer engagements; client or customer services;
            any confidential information about (or provided by) any client or
            customer or prospective or former client or customer of the Company;
            vendor lists; any confidential information about (or provided by)
            any vendor or prospective or former vendor of the Company;
            information concerning the Company&apos;s business or financial
            affairs, including its books and records, financial statements,
            commitments, business or strategic procedures, business or strategic
            plans, cost data and financial information; information relating to
            or concerning finances, sales, business development, marketing,
            advertising, promotions, pricing, personnel, suppliers, vendors,
            partners and/or competitors; products developed by the Company;
            confidential information provided to the Company by third parties;
            software, technology related information, intellectual property;
            institutional knowledge and know-how, attorney work product and
            attorney client information, and similar confidential materials or
            information respecting the Company&apos;s business affairs,
            regardless of whether the information is marked as confidential or
            otherwise protected. Contractor agrees that all Confidential
            Information is, and shall continue to be, the exclusive property of
            the Company and/or the Company’s client(s), customers or vendors.
            Contractor agrees that Contractor shall not, at any time following
            execution of this Agreement, use disclose, disseminate or publicize
            any Confidential Information of the Company to any third party for
            any purpose other than providing services for the Company without
            advance written consent of the Company. Contractor agrees to ensure
            that any employees, contractors or representatives of Contractor
            comply with the confidentiality provisions of this Agreement.
          </Text>

          <Text style={styles.listItem}>
            5.{" "}
            <Text style={styles.bold}>
              Non-Compete, Non-Solicitation and Non-Disparagement Provisions
            </Text>
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (a) <Text style={styles.bold}>Non-Compete.</Text> During the term of
            this Agreement, and for a period of one year following the
            termination of this Agreement, Contractor agrees that Contractor
            will not, for Contractor or on behalf of any other person or
            business enterprise, engage in any business activity that competes
            with the Company, nor work for (either as an employee or contractor)
            any company that competes with the Company.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (b) <Text style={styles.bold}>Non-Solicitation.</Text> During the
            term of this Agreement, and for a period of one year following the
            termination of this Agreement, Contractor agrees not to solicit any
            employee or independent contractor of the Company on behalf of any
            other business enterprise, nor shall Contractor induce any other
            employee or independent contractor associated with the Company to
            terminate or breach an employment, contractual or other relationship
            with the Company. For a period of one year following the termination
            of this Agreement, Contractor shall not, directly or indirectly,
            disclose to any person, firm, corporation, or other business entity
            the names and addresses of any of the clients or customers of the
            Company or any information pertaining to them. Further, Contractor
            shall not call on, solicit, take away, or attempt to call on,
            solicit, or take away any client or customer of the Company on whom
            Contractor has called or with whom Contractor became acquainted with
            or aware of during the term of this Agreement, as a direct or
            indirect result of Contractor’s relationship with the Company.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (c) <Text style={styles.bold}>Non-Disparagement:</Text> During the
            term of this Agreement and following the termination of this
            Agreement, Contractor agrees that Contractor will not disparage the
            Company or any of its directors, officers, agents or executives and
            Contractor further agrees that Contractor will not voluntarily make
            any oral or written statements or reveal any information to any
            person, partnership, firm, company, corporation, agency or other or
            entity, which disparages or damages the Company’s reputation or
            business, or which interferes with the Company’s business.
            Contractor agrees to ensure that any employees, contractors or
            representatives of Contractor comply with the Non-Compete,
            Non-Solicitation and Non-Disparagement provisions of this Agreement.
          </Text>

          <Text style={styles.listItem}>
            6. <Text style={styles.bold}>Return of Materials</Text>
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            Contractor agrees that, upon termination of this Agreement,
            Contractor will return to the Company all property, documents (in
            any form) and any other materials containing or disclosing any
            Confidential Information of the Company. Contractor will not retain
            any such materials. Alternatively, Contractor may provide, in a form
            satisfactory to the Company, documentation verifying that all
            documents and other materials containing or disclosing any
            Confidential Information has been permanently deleted and/or
            destroyed.
          </Text>

          <Text style={styles.listItem}>
            7.{" "}
            <Text style={styles.bold}>
              Company Property, Works Made for Hire.
            </Text>
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            The results and proceeds of the Contractor’s services or work
            hereunder, including, without limitation, materials, products,
            frameworks, policies and procedures, protocols, methodologies, risk,
            compliance and other assessment tools and methodologies, projects,
            inventions, discoveries, designs and all parts thereof, and/or works
            of authorship or works in progress that Contractor creates resulting
            from Contractor’s services during the term of this Agreement with
            the Company or Contractor’s use of any of the Company’s equipment,
            supplies, facilities, services or Confidential Information
            (collectively, the “Company Materials”), in addition to any and all
            copyrights, trademarks and patents, extensions and renewals thereof
            under United States and all other laws related to such Company
            Materials, shall be Company’s sole and exclusive property, free from
            any adverse claims. All Company Materials shall be deemed “works
            made for hire”. The Company will be deemed the sole owner throughout
            the universe of any and all rights of whatsoever nature therein,
            whether or not now or hereafter known, existing, contemplated,
            recognized or developed, with the right to use the same in
            perpetuity in any manner the Company determines in its sole
            discretion without any further payment to Contractor whatsoever. If,
            for any reason, any of the Company Materials are deemed not to
            legally be a work-for-hire and/or there are any rights which do not
            accrue to the Company hereunder or pursuant to law, then Contractor
            hereby irrevocably assigns and agrees to assign any and all of
            Contractor’s rights, titles and interests thereto, including,
            without limitation, any nd all copyrights, patents, trade secrets,
            trademarks and/or other rights of whatsoever nature therein, whether
            or not now or hereafter known, existing, contemplated, recognized or
            developed, to the Company, and the Company will have the right to
            use the same in perpetuity throughout the universe in any manner the
            Company determines without any further payment to Contractor
            whatsoever. Contractor will, from time to time, as may be requested
            and directed by the Company during or subsequent to the termination
            of this Agreement (at the Company’s reasonable expense, if any), do
            any and all things which the Company may deem useful or desirable to
            assist, establish, protect or document the Company’s exclusive
            ownership of any and all rights in any Company Materials, including,
            without limitation, the execution of appropriate copyright and/or
            patent applications or assignments. To the extent the Contractor has
            any rights in the Company Materials or results and proceeds of
            Contractor’s services that cannot be assigned in the manner
            described above, Contractor unconditionally and irrevocably waives
            the enforcement of such rights. Contractor’s obligations to assign
            property rights under this paragraph will not, however, apply to any
            other materials, products, projects, inventions, discoveries, or
            designs and all parts thereof, and/or works of authorship or works
            in progress (“Non-Company Materials”) for which Contractor can
            clearly establish and prove all of the following: (i) the
            Non-Company Materials were developed entirely on Contractor’s own
            time; (ii) no Company or Company-affiliated entities’ equipment,
            supplies, facility, services, or Confidential Information were used
            in the development of the Non-Company Materials; (iii) the
            Non-Company Materials do not relate directly to the business of the
            Company, or to the actual or demonstrably anticipated research or
            development of the Company; and (iv) the Non-Company Materials do
            not result from any work performed by Contractor for the Company or
            other persons engaged to perform services by the Company.
          </Text>

          <Text style={styles.listItem}>
            8.{" "}
            <Text style={styles.bold}>
              Acknowledgements and Representations
            </Text>
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            Contractor acknowledges and represents that: (a) this agreement to
            perform Services pursuant to this Agreement does not violate any
            agreement or obligation between Contractor and a third party; (b)
            all services provided by Contractor shall be performed in a
            professional, lawful and timely manner, and shall meet deadlines
            agreed to by Contractor and the Company; (c) as an independent
            contractor, Contractor is solely responsible for any property
            damage, bodily injury or death caused by Contractor, or Contractor’s
            agents; (d) Contractor will comply in all respects with the terms
            and conditions set forth in Sections 4 and 5 of this Agreement; and
            (e) Contractor acknowledges and agrees that, upon termination of
            this Agreement, Contractor is not eligible for unemployment
            benefits. Contractor will immediately notify the Company if
            circumstances change that may or do affect the Contractor’s ability
            to comply with the acknowledgements and representation set forth in
            this Section 8 or any other terms, conditions or provisions of this
            Agreement.
          </Text>

          <Text style={styles.listItem}>
            9. <Text style={styles.bold}>Mediation and Arbitration.</Text>
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            Any and all disputes arising under or in connection with this
            Agreement shall first be resolved through informal or formal
            mediation through JAMS, unless otherwise agreed upon by the parties
            to engage in private mediation outside of JAMS. Any disputes that
            cannot be mutually resolved by the parties hereto shall be settled
            exclusively by arbitration in the Borough of Manhattan, New York in
            accordance with the then existing Arbitration Rules and Procedures
            of JAMS before a single arbitrator selected according to the
            applicable JAMS rules. The agreement to arbitrate and the rights of
            the parties hereunder shall be governed by and construed in
            accordance with the laws of the State of New York, without regard to
            conflict or choice of law rules. The arbitration award shall be
            written, reasoned, and shall include findings of fact as to all
            factual issues and conclusions of law as to all legal issues. The
            arbitration shall be confidential. Judgment may be entered on the
            arbitrators’ award in any court having jurisdiction. Each party
            shall bear its own legal fees and out-of-pocket expenses incurred in
            any arbitration hereunder; provided, that, the arbitrator in any
            arbitration as part of the arbitrator’s award shall have the
            authority to award reasonable attorneys’ fees to the prevailing
            party if permissible under any statutory law which is subject of the
            arbitration as would be the case had the dispute or controversy been
            argued before a court with competent jurisdiction.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            Notwithstanding the above, the Company may bring an action or
            special proceeding in any court of competent jurisdiction for the
            purpose of compelling a party to arbitrate, seeking temporary or
            preliminary relief in aid of an arbitration hereunder (without the
            requirement of any bond) and/or enforcing an arbitration award. The
            Company is entitled to consequential damages and attorney’s fees and
            costs in any action commenced seeking injunctive relief. Contractor
            irrevocably submits to the jurisdiction of a court of competent
            jurisdiction located in the Borough of Manhattan, New York for the
            purpose of any judicial proceeding brought in accordance with this
            section or any judicial proceeding ancillary to an arbitration or
            contemplated arbitration arising out of or relating to or concerning
            this Agreement. Such ancillary judicial proceedings include any
            suit, action or proceeding to compel arbitration, to obtain
            temporary or preliminary judicial relief in aid of arbitration or to
            confirm an arbitration award. Contractor hereby waives, to the
            fullest extent permitted by applicable law, any objection which
            Contractor now or hereafter may have to personal jurisdiction or to
            the laying of venue of any such ancillary suit, action or proceeding
            brought in any court referred to in this section and agrees not to
            plead or claim the same. Contractor further waives, to the fullest
            extent permitted by applicable law, any right that may exist to a
            jury trial or to participation as a member of a class in any
            proceeding.
          </Text>

          <Text style={styles.listItem}>
            10. <Text style={styles.bold}>Indemnity</Text>
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            Contractor agrees to indemnify, defend, and hold the Company and its
            successors, officers, directors, agents and employees harmless
            against any and all losses, damages, liabilities, deficiencies,
            claims, actions, judgments, settlements, interest, awards,
            penalties, fines, costs, or expenses of whatever kind, including
            reasonable attorneys’ fees and expenses, fees and the costs of
            enforcing any right to indemnification under this Agreement, and the
            cost of pursuing any insurance providers (collectively, “Losses”),
            relating to any claim of a third party or the Company arising out of
            or occurring in connection from the provision of the Services,
            including, but not limited to, any taxation whatsoever arising from
            or made in connection with the performance of the Services, where
            such recovery is not prohibited by law and any employment-related
            claim or any claim based on worker status (including reasonable
            costs and expenses) brought by Contractor or on behalf of
            Contractor, or any substitute against the Company arising out of or
            in connection with the provision of the Services.
          </Text>

          <Text style={styles.listItem}>
            11. <Text style={styles.bold}>Miscellaneous</Text>
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (a) <Text style={styles.bold}>Governing Law:</Text> This Agreement
            shall be governed by and construed in accordance with the laws of
            the State of Florida without regard to conflict of law principles.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (b) <Text style={styles.bold}>Entire Agreement:</Text> This
            Agreement, contains the entire agreement and understanding between
            the parties hereto and supersedes any prior or contemporaneous
            written or oral agreements, representation and warranties between
            them respecting the subject matter hereof.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (c) <Text style={styles.bold}>Amendment and Modification:</Text>{" "}
            This Agreement may be amended only by a writing signed by Contractor
            and by a duly authorized representative of the Company.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (d) <Text style={styles.bold}>Severability:</Text> If any term,
            provision, covenant or condition of this Agreement, or the
            application thereof to any person, place or circumstance, shall be
            held to be invalid, unenforceable or void, the remainder of this
            Agreement and such term, provision, covenant or condition as applied
            to other persons, places and circumstances shall remain in full
            force and effect.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (e) <Text style={styles.bold}>Construction:</Text> The headings and
            captions of this Agreement are provided for convenience only and are
            intended to have no effect in construing or interpreting this
            Agreement. The language in all parts of this Agreement shall be in
            all cases construed according to its fair meaning and not strictly
            for or against either party.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (f) <Text style={styles.bold}>Non-waiver:</Text> Failure of either
            party hereto to exercise any right, power or privilege hereunder or
            under law shall not constitute a waiver of any other right, power or
            privilege or of the same right, power or privilege in any other
            instance.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (g) <Text style={styles.bold}>Remedy for Breach:</Text> The parties
            agree that, in the event of breach or threatened breach of any
            covenants of Contractor, the damage or imminent damage to the value
            and the goodwill of the Company’s business shall be inestimable, and
            therefore any remedy at law or in damages shall be inadequate.
            Accordingly, the parties agree that the Company shall be entitled to
            injunctive relief against Contractor in the event of any breach or
            threatened breach of any such provisions by Contractor, in addition
            to any other relief (including damages) available to the Company
            under this Agreement or under law.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (h) <Text style={styles.bold}>Notices</Text> Any notice required or
            permitted to be given under this Agreement or pursuant to law shall
            be sufficient if in writing, including email to the email address on
            record for each party.
          </Text>
          <Text style={[styles.paragraph, styles.indent]}>
            (i) The Company may, in its discretion, notify any future
            prospective third party of the existence of this Agreement.
          </Text>
        </View>

        <Text style={[styles.paragraph, { marginTop: 14 }]}>
          CONTRACTOR REPRESENTS THAT CONTRACTOR HAS CONSULTED WITH OR WAS
          ADVISED AND AFFORDED THE OPPORTUNITY TO CONSULT WITH, THE ATTORNEY OF
          CONTRACTOR’S CHOICE, AND THAT THE TERMS OF THIS AGREEMENT ARE FULLY
          UNDERSTOOD AND VOLUNTARILY ACCEPTED BY CONTRACTOR. CONTRACTOR
          UNDERSTANDS AND ACKNOWLEDGES THAT THIS RELATIONSHIP IS AN INDEPENDENT
          CONTRACTOR RELATIONSHIP. CONTRACTOR AFFIRMS THAT CONTRACTOR HAS NO
          PHYSICAL OR MENTAL IMPAIRMENT OF ANY KIND THAT HAS INTERFERED WITH
          CONTRACTOR’S ABILITY TO READ AND UNDERSTAND THE MEANING OF THIS
          AGREEMENT OR ITS TERMS. CONTRACTOR ACKNOWLEDGES THAT CONTRACTOR HAS
          BEEN GIVEN A REASONABLE PERIOD OF TIME TO CONSIDER THIS AGREEMENT,
          THAT CONTRACTOR HAS FREELY, KNOWINGLY AND VOLUNTARILY DECIDED TO
          ACCEPT THE TERMS OF THIS AGREEMENT, AND THAT THIS AGREEMENT HAS
          BINDING LEGAL EFFECT.
        </Text>

        <View
          style={{
            marginTop: 24,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ width: "45%" }}>
            <Text>ANDES WORKFORCE LLC</Text>
            <Text style={{ marginTop: 28 }}>
              By: __________________________
            </Text>
            <Text>Date: ________________________</Text>
          </View>
          <View style={{ width: "45%" }}>
            <Text>CONTRACTOR</Text>
            <Text style={{ marginTop: 28 }}>
              By: {data.nombreCompleto || "__________________________"}
            </Text>
            <Text>Date: ________________________</Text>
          </View>
        </View>

        <Text style={[styles.title, { marginTop: 28 }]}>
          EXHIBIT A - STATEMENT OF WORK
        </Text>

        <Text style={styles.sectionHeading}>Services</Text>
        <Text style={styles.paragraph}>
          The Contractor will provide the following Services:
        </Text>
        <Text style={styles.paragraph}>
          {data.descripcionServicios &&
          data.descripcionServicios.trim().length > 0
            ? data.descripcionServicios
            : servicesDefault}
        </Text>

        <Text style={styles.paragraph}>
          In connection with this Statement of Work, the parties may reach out
          to each other as follows:
        </Text>
        <Text style={styles.paragraph}>
          Contact person (Company):{"\n"}Miguel Rendon{"\n"}
          info@andes-workforce.com{"\n"}(“Key Company Contact”)
        </Text>
        <Text style={styles.paragraph}>
          Contact person (Contractor):{"\n"}
          {data.nombreCompleto || "Name"}
          {"\n"}
          {data.correoElectronico || "email@example.com"}
          {"\n"}(“Key Contractor Contact”)
        </Text>

        <Text style={styles.sectionHeading}>Service Fee</Text>
        <Text style={styles.paragraph}>
          As of the Start Date, Contractor will be paid a fee of USD{" "}
          {fmtMoney(data.ofertaSalarial)} fixed per month. This Service Fee will
          be increased by 5% annually. Additionally, Contractor is eligible to
          receive a bonus at the end of each calendar year. Any bonus will be
          prorated for Contractors who have completed less than 6 months of work
          at the end of the calendar year.
        </Text>
      </Page>
    </Document>
  );
};

export default IndependentContractorAgreementUsaPDF;
