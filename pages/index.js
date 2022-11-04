
import * as React from 'react'
import LandingSection from '../sections/landing'
import ToolbarSection from '../sections/toolbar'
import VerificationSection from '../sections/verification'


export default function Demo() {

  const sections = {
    landing: LandingSection,
    verification: VerificationSection
  }

  const [section, setSection] = React.useState(['landing', {}])

  const sectionContent = React.useMemo(() => {
    return Object.entries(sections).map(([key, Section]) => {
      console.log(key)
      return <Section key={key} show={section[0] == key} setSection={setSection} {...section[1]} />
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


