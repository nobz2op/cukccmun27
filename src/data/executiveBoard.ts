export type ExecutiveBoardMember = {
  name: string
  designation: string
  photo?: string
}

export type ExecutiveBoardCommittee = {
  id: string
  title: string
  members: ExecutiveBoardMember[]
}

export const executiveBoard: ExecutiveBoardCommittee[] = [
  {
    id: 'unga',
    title: 'UNGA – UNITED NATIONS GENERAL ASSEMBLY',
    members: [
      {
        name: 'Soheth A Robin',
        designation: 'Chairperson',
        photo: '/images/executive-board/soheth.jpeg',
      },
      {
        name: 'Mohammed Shahid Shamnad',
        designation: 'Vice Chairperson',
        photo: '/images/executive-board/shahidh.PNG',
      },
      {
        name: 'Matheswaran',
        designation: 'Rapporteur',
        photo: '/images/executive-board/Mathewsaran.jpeg',
      },
    ],
  },
  {
    id: 'wls',
    title: 'WLS – WORLD LEADERS SUMMIT',
    members: [
      {
        name: 'Arjun S Nair',
        designation: 'Chairperson',
        photo: '/images/executive-board/arjun.jpeg',
      },
      {
        name: 'Pramith C Menon',
        designation: 'Vice Chairperson',
        photo: '/images/executive-board/pramith.jpeg',
      },
      {
        name: 'Amrin Hakkim',
        designation: 'Rapporteur',
        photo: '/images/executive-board/Amrin.jpeg',
      },
    ],
  },
  {
    id: 'international-press',
    title: 'INTERNATIONAL PRESS',
    members: [
      {
        name: 'Devak B B',
        designation: 'Head of Photography',
        photo: '/images/executive-board/devak.jpeg',
      },
      // Temporarily excluded from the Executive Board listing.
      // {
      //   name: 'Lekshmi Sony',
      //   designation: 'Head of Journalism',
      //   photo: '/images/executive-board/lekshmi.jpeg',
      // },
    ],
  },
]
