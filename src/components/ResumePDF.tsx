import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { format } from "date-fns";

// Helper to strip HTML tags and handle basic formatting
const stripHtml = (html: string) => {
  if (!html) return "";
  // Replace <br>, <p>, </div> with newlines
  let text = html.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n");
  text = text.replace(/<\/div>/gi, "\n");
  text = text.replace(/<\/li>/gi, "\n");
  // Replace <li> with bullet point
  text = text.replace(/<li[^>]*>/gi, "• ");
  // Strip all other tags
  text = text.replace(/<[^>]+>/g, "");
  // Decode HTML entities (basic ones)
  text = text.replace(/&nbsp;/g, " ");
  text = text.replace(/&amp;/g, "&");
  text = text.replace(/&lt;/g, "<");
  text = text.replace(/&gt;/g, ">");
  return text.trim();
};

const formatDate = (dateString: string | undefined, formatStr: string) => {
  if (!dateString) return "";
  try {
    return format(new Date(dateString), formatStr);
  } catch (e) {
    return dateString;
  }
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30, // Approx 10mm, compact to fit 1 page
    fontFamily: "Helvetica",
    fontSize: 9, // Reduced font size to fit more content
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    gap: 15,
  },
  headerText: {
    flexDirection: "column",
    flex: 1,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30, // Circle
    objectFit: "cover",
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: "medium",
    marginBottom: 2,
  },
  contactInfo: {
    fontSize: 8,
    color: "#6B7280", // text-gray-500
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  separator: {
    borderBottomWidth: 1.5,
    marginBottom: 6,
  },
  item: {
    marginBottom: 6,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 1,
  },
  itemTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },
  itemDate: {
    fontSize: 8,
    color: "#374151",
  },
  itemSubtitle: {
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 1,
  },
  description: {
    fontSize: 9,
    textAlign: "justify",
    color: "#1F2937",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skill: {
    fontSize: 9,
  },
});

interface ResumePDFProps {
  resumeData: any;
}

const ResumePDF: React.FC<ResumePDFProps> = ({ resumeData }) => {
  const colorHex = resumeData.colorHex || "#000000";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Personal Info */}
        <View style={styles.header}>
          {resumeData.photo && (
            <Image
              src={
                typeof resumeData.photo === "string"
                  ? resumeData.photo
                  : URL.createObjectURL(resumeData.photo)
              }
              style={styles.photo}
            />
          )}
          <View style={styles.headerText}>
            <Text style={[styles.name, { color: colorHex }]}>
              {resumeData.firstName} {resumeData.lastName}
            </Text>
            <Text style={styles.jobTitle}>{resumeData.jobTitle}</Text>
            <View style={styles.contactInfo}>
              <Text>
                {resumeData.city}
                {resumeData.city && resumeData.country ? ", " : ""}
                {resumeData.country}
              </Text>
              {(resumeData.phone || resumeData.email) && <Text>•</Text>}
              {resumeData.phone && <Text>{resumeData.phone}</Text>}
              {resumeData.phone && resumeData.email && <Text>•</Text>}
              {resumeData.email && <Text>{resumeData.email}</Text>}
              {(resumeData.linkedin || resumeData.website) && <Text>•</Text>}
              {resumeData.linkedin && <Text>LinkedIn</Text>}
              {resumeData.linkedin && resumeData.website && <Text>•</Text>}
              {resumeData.website && <Text>Website</Text>}
            </View>
          </View>
        </View>

        {/* Summary */}
        {resumeData.summary && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorHex }]}>
              SUMMARY
            </Text>
            <View style={[styles.separator, { borderBottomColor: colorHex }]} />
            <Text style={styles.description}>
              {stripHtml(resumeData.summary)}
            </Text>
          </View>
        )}

        {/* Work Experience */}
        {resumeData.workExperiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorHex }]}>
              EXPERIENCE
            </Text>
            <View style={[styles.separator, { borderBottomColor: colorHex }]} />
            {resumeData.workExperiences.map((exp: any, index: number) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDate}>
                    {formatDate(exp.startDate, "MM/yyyy")} -{" "}
                    {exp.endDate
                      ? formatDate(exp.endDate, "MM/yyyy")
                      : "Present"}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <Text style={styles.itemSubtitle}>{exp.company}</Text>
                  <Text style={{ fontSize: 8, fontStyle: "italic" }}>
                    {exp.locationType}
                  </Text>
                </View>
                <Text style={styles.description}>
                  {stripHtml(exp.description)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Projects */}
        {resumeData.projects?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorHex }]}>
              PROJECTS
            </Text>
            <View style={[styles.separator, { borderBottomColor: colorHex }]} />
            {resumeData.projects.map((proj: any, index: number) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{proj.ProjectName}</Text>
                  <Text style={styles.itemDate}>
                    {formatDate(proj.startDate, "MM/yyyy")} -{" "}
                    {proj.endDate
                      ? formatDate(proj.endDate, "MM/yyyy")
                      : "Present"}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.itemSubtitle,
                    { fontStyle: "italic", fontWeight: "normal" },
                  ]}
                >
                  {proj.toolsUsed}
                </Text>
                <Text style={styles.description}>
                  {stripHtml(proj.description)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resumeData.educations?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorHex }]}>
              EDUCATION
            </Text>
            <View style={[styles.separator, { borderBottomColor: colorHex }]} />
            {resumeData.educations.map((edu: any, index: number) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemDate}>
                    {formatDate(edu.startDate, "MM/yyyy")} -{" "}
                    {edu.endDate
                      ? formatDate(edu.endDate, "MM/yyyy")
                      : "Present"}
                  </Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.school}</Text>
                {edu.description && (
                  <Text style={styles.description}>
                    {stripHtml(edu.description)}
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {resumeData.skills?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorHex }]}>
              SKILLS
            </Text>
            <View style={[styles.separator, { borderBottomColor: colorHex }]} />
            <View style={styles.skillsContainer}>
              <Text style={styles.skill}>
                {Array.isArray(resumeData.skills)
                  ? resumeData.skills.join(", ")
                  : resumeData.skills}
              </Text>
            </View>
          </View>
        )}

        {/* Certifications */}
        {resumeData.certifications?.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorHex }]}>
              CERTIFICATIONS
            </Text>
            <View style={[styles.separator, { borderBottomColor: colorHex }]} />
            {resumeData.certifications.map((cert: any, index: number) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{cert.certificationName}</Text>
                  <Text style={styles.itemDate}>
                    {formatDate(cert.awardedDate, "MM/yyyy")}
                  </Text>
                </View>
                <Text style={styles.description}>{cert.awardedBy}</Text>
              </View>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF;
