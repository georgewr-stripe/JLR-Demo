
import { useRouter } from 'next/router'
import * as React from 'react'
import BookedInSection from '../sections/test_drive/bookedIn'
import LandingSection from '../sections/test_drive/landing'
import TestDriveSection from '../sections/test_drive/testDrive'
import ToolbarSection from '../sections/toolbar'
import VerificationSection from '../sections/test_drive/verification'


export default function TestDrive() {

  const router = useRouter()

  const sections = {
    landing: LandingSection,
    verification: VerificationSection,
    testDrive: TestDriveSection,
    bookedIn: BookedInSection
  }
  const [section, setSection] = React.useState(['landing', {}])

  React.useEffect(() => {
    if (router.query.section) {
      if (router.query.section !== section[0]) {
        setSection([router.query.section, {}])
      }
    }
  }, [section, router.query])




  const handleSectionChange = (sectionName, props) => {
    router.push('/?section=' + sectionName, undefined, { shallow: true })
    setSection([sectionName, props])
  }

  const sectionContent = React.useMemo(() => {
    return Object.entries(sections).map(([key, Section]) => {
      return <Section key={key} show={section[0] == key} setSection={handleSectionChange} {...section[1]} />
    })
  }, [section])

  return (
    <div className="bg-white h-full">
      <div className="relative overflow-hidden">
        <ToolbarSection />
        <main className='h-screen'>
          {sectionContent}
        </main>
      </div>
    </div>
  )
}


