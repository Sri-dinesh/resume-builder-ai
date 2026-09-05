import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Link,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import React from "react";
import type { ResumeValues } from "@/lib/resume/validation";

import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Computer Modern Serif Roman",
  fonts: [
    { src: "/fonts/computer-modern/cmu-serif-500-roman.ttf" },
    { src: "/fonts/computer-modern/cmu-serif-700-roman.ttf", fontWeight: "bold" },
    { src: "/fonts/computer-modern/cmu-serif-500-italic.ttf", fontStyle: "italic" },
    { src: "/fonts/computer-modern/cmu-serif-700-italic.ttf", fontWeight: "bold", fontStyle: "italic" },
  ],
});

const stripHtml = (html: string) => {
  if (!html) return "";
  let text = html.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n");
  text = text.replace(/<\/div>/gi, "\n");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<li[^>]*>/gi, "• ");
  text = text.replace(/<[^>]+>/g, "");
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
  } catch {
    return dateString;
  }
};

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 36,
    fontSize: 11,
    lineHeight: 1.4,
  },
  header: {
    flexDirection: "column",
    alignItems: "center",
    marginBottom: 12,
  },
  photo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    objectFit: "cover",
    marginBottom: 6,
  },
  name: {
    fontSize: 24.9,
    fontWeight: "bold",
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  contactInfo: {
    fontSize: 11,
    color: "#374151",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 3,
  },
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  separator: {
    borderBottomWidth: 0.3,
    marginBottom: 4,
  },
  item: {
    marginBottom: 4,
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 1,
  },
  itemTitle: {
    fontSize: 11,
    fontWeight: "bold",
  },
  itemDate: {
    fontSize: 10,
  },
  itemSubtitle: {
    fontSize: 10,
    marginBottom: 1,
  },
  description: {
    fontSize: 10,
    textAlign: "justify",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  bulletText: {
    fontSize: 10,
    flex: 1,
    textAlign: "justify",
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  skill: {
    fontSize: 11,
  },
});

interface ResumePDFProps {
  resumeData: ResumeValues;
}

const ResumePDF: React.FC<ResumePDFProps> = ({ resumeData }) => {
  const colorHex = resumeData.colorHex || "#000000";
  const fontFamily = resumeData.fontFamily || "Computer Modern Serif Roman";
  const headerAlignment = resumeData.headerAlignment || "center";

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily }]}>
        {/* Personal Info */}
        <View 
          style={[
            styles.header,
            headerAlignment === "left"
              ? { alignItems: "flex-start" }
              : headerAlignment === "right"
                ? { alignItems: "flex-end" }
                : { alignItems: "center" },
          ]}
        >
          {resumeData.photo && (
            // eslint-disable-next-line jsx-a11y/alt-text
            <Image
              src={
                typeof resumeData.photo === "string"
                  ? resumeData.photo
                  : URL.createObjectURL(resumeData.photo)
              }
              style={styles.photo}
            />
          )}
          <Text style={[styles.name, { color: colorHex }]}>
            {resumeData.firstName} {resumeData.lastName}
          </Text>
          {resumeData.jobTitle && <Text style={styles.jobTitle}>{resumeData.jobTitle}</Text>}
          <View 
            style={[
              styles.contactInfo,
              headerAlignment === "left"
                ? { justifyContent: "flex-start" }
                : headerAlignment === "right"
                  ? { justifyContent: "flex-end" }
                  : { justifyContent: "center" },
            ]}
          >
            {resumeData.phone && <Text>{resumeData.phone}</Text>}
            
            {resumeData.phone && (resumeData.city || resumeData.country || resumeData.email || resumeData.contactLinks?.length) && <Text>⋄</Text>}
            
            {(resumeData.city || resumeData.country) && (
              <Text>
                {resumeData.city}
                {resumeData.city && resumeData.country ? ", " : ""}
                {resumeData.country}
              </Text>
            )}
            
            {(resumeData.city || resumeData.country) && (resumeData.email || resumeData.contactLinks?.length) && <Text>⋄</Text>}

            {resumeData.email && <Text>{resumeData.email}</Text>}
            
            {resumeData.email && resumeData.contactLinks?.length ? <Text>⋄</Text> : null}
            
            {resumeData.contactLinks?.map((link, index) => {
              if (!link.url) return null;
              return (
                <React.Fragment key={index}>
                  <Text>{link.linkName || link.url.replace(/^https?:\/\//, "")}</Text>
                  {index < ((resumeData.contactLinks?.length || 1) - 1) && <Text>⋄</Text>}
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* Summary */}
        {resumeData.summary && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorHex }]}>
              Objective
            </Text>
            <View style={[styles.separator, { borderBottomColor: colorHex }]} />
            <Text style={styles.description}>
              {stripHtml(resumeData.summary)}
            </Text>
          </View>
        )}

        {/* Work Experience */}
        {resumeData.workExperiences &&
          resumeData.workExperiences.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colorHex }]}>
                Experience
              </Text>
              <View
                style={[styles.separator, { borderBottomColor: colorHex || "#000000" }]}
              />
              {resumeData.workExperiences.map((exp, index) => (
                <View key={index} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{exp.company}</Text>
                    <Text style={[styles.itemDate, { fontWeight: "bold" }]}>
                      {exp.startDate && (
                        <>
                          {formatDate(exp.startDate, "MMM yyyy")} -{" "}
                          {exp.endDate
                            ? formatDate(exp.endDate, "MMM yyyy")
                            : "Present"}
                        </>
                      )}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 2,
                    }}
                  >
                    <Text style={[styles.itemSubtitle, { fontStyle: "italic", fontSize: 11 }]}>{exp.position}</Text>
                    <Text style={{ fontSize: 10, fontStyle: "italic" }}>
                      {exp.locationType}
                    </Text>
                  </View>
                  {exp.description && exp.description.length > 0 && (
                    <View style={{ marginTop: 2, paddingLeft: 8 }}>
                      {exp.description.map((bullet, i) => (
                        <View key={i} style={styles.bulletRow}>
                          <Text style={{ fontSize: 10, width: 7 }}>•</Text>
                          <Text style={styles.bulletText}>
                            {stripHtml(bullet)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              ))}
            </View>
          )}

        {/* Projects */}
        {resumeData.projects && resumeData.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorHex }]}>
              Projects
            </Text>
            <View style={[styles.separator, { borderBottomColor: colorHex || "#000000" }]} />
            {resumeData.projects.map((proj, index) => (
              <View key={index} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>
                    {proj.ProjectName}
                    {proj.toolsUsed && (
                      <Text style={{ fontWeight: "normal" }}>
                        {" | "}
                        <Text style={{ fontStyle: "italic" }}>{proj.toolsUsed}</Text>
                      </Text>
                    )}
                  </Text>
                  <View style={{ flexDirection: "row", gap: 4 }}>
                    {proj.demoLink && proj.demoLink.startsWith("http") && (
                      <Link src={proj.demoLink} style={{ fontSize: 10, fontWeight: "bold", color: "#000000" }}>
                        DEMO
                      </Link>
                    )}
                    {proj.githubUrl && proj.githubUrl.startsWith("http") && (
                      <Link src={proj.githubUrl} style={{ fontSize: 10, fontWeight: "bold", color: "#000000" }}>
                        CODE
                      </Link>
                    )}
                  </View>
                </View>
                {proj.description && proj.description.length > 0 && (
                  <View style={{ marginTop: 2, paddingLeft: 8 }}>
                    {proj.description.map((bullet, i) => (
                      <View key={i} style={styles.bulletRow}>
                        <Text style={{ fontSize: 10, width: 7 }}>•</Text>
                        <Text style={styles.bulletText}>
                          {stripHtml(bullet)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {resumeData.educations && resumeData.educations.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorHex }]}>
              Education
            </Text>
            <View style={[styles.separator, { borderBottomColor: colorHex || "#000000" }]} />
            {resumeData.educations.map((edu, index) => {
              const schoolParts = edu.school?.split(",") || [];
              const institution = schoolParts[0]?.trim();
              const location = edu.location || (schoolParts.length > 1 ? schoolParts.slice(1).join(",").trim() : "");
              return (
                <View key={index} style={[styles.item, { marginTop: 2 }]}>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.itemTitle, { fontSize: 11 }]}>{institution}</Text>
                    {(edu.startDate || edu.endDate) && (
                      <Text style={{ fontWeight: "bold", fontSize: 10 }}>
                        {edu.startDate ? formatDate(edu.startDate, "MMM yyyy") : ""}
                        {edu.startDate && edu.endDate ? " - " : ""}
                        {edu.endDate ? formatDate(edu.endDate, "MMM yyyy") : edu.startDate ? " - Present" : "Present"}
                      </Text>
                    )}
                  </View>
                  <View style={[styles.itemHeader, { marginTop: 1 }]}>
                    <Text style={{ fontStyle: "italic", fontSize: 10 }}>{edu.degree}</Text>
                    {location && <Text style={{ fontStyle: "italic", fontSize: 10 }}>{location}</Text>}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Skills */}
        {Array.isArray(resumeData.skills) && resumeData.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorHex }]}>
              Technical Skills
            </Text>
            <View style={[styles.separator, { borderBottomColor: colorHex || "#000000" }]} />
            <Text style={styles.description}>
              {Array.isArray(resumeData.skills)
                ? resumeData.skills.join(", ")
                : resumeData.skills}
            </Text>
          </View>
        )}

        {/* Certifications */}
        {resumeData.certifications && resumeData.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colorHex }]}>
              Certifications
            </Text>
            <View style={[styles.separator, { borderBottomColor: colorHex || "#000000" }]} />
            <View style={{ paddingLeft: 8 }}>
              {resumeData.certifications.map((cert, index) => (
                <View key={index} style={styles.bulletRow}>
                  <Text style={{ fontSize: 10, width: 7 }}>•</Text>
                  <Text style={styles.bulletText}>
                    <Text style={{ fontWeight: "bold" }}>{cert.certificationName}. </Text>
                    {cert.awardedBy && <Text>{cert.awardedBy}</Text>}
                    {cert.awardedDate && (
                      <Text> - {formatDate(cert.awardedDate, "MMM yyyy")}</Text>
                    )}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default ResumePDF;
