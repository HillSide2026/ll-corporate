/** Levine Law lawyers shown to leads on the portal welcome page. Photos from legal.levine-law.ca. */
export type TeamMember = {
  name: string
  title: string
  photo: string
}

export const lawyers: TeamMember[] = [
  { name: "Matthew Levine", title: "Barrister & Solicitor", photo: "/team/matthew-levine.jpg" },
  { name: "Laura Hinton", title: "Barrister & Solicitor", photo: "/team/laura-hinton.jpg" },
]
