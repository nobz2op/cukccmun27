export type RegistrationForm = {
  id: string
  title: string
  url: string
  iframeTitle: string
}

export const registrationForms: RegistrationForm[] = [
  {
    id: 'campus-ambassador',
    title: 'CAMPUS AMBASSADOR',
    url: 'https://tally.so/embed/rDaGrp?alignLeft=1&hideTitle=1&dynamicHeight=1',
    iframeTitle: "CUKCCMUN'27 Campus Ambassador registration form",
  },
  {
    id: 'priority-round',
    title: "CUKCCMUN'27 PRIORITY ROUND",
    url: 'https://tally.so/embed/zEMvJ0?alignLeft=1&hideTitle=1&dynamicHeight=1',
    iframeTitle: "CUKCCMUN'27 Priority Round registration form",
  },
]
