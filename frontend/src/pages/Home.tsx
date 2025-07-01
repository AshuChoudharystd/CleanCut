import BestSeller from '../components/BestSeller'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import LatestCollections from '../components/LatestCollections'
import NewsLetterBox from '../components/NewsLetterBox'
import OurPolicy from '../components/OurPolicy'

const Home = () => {
  return (
    <div>
       <Hero></Hero>
       <LatestCollections />
       <BestSeller />
       <OurPolicy />
       <NewsLetterBox />
    </div>
  )
}

export default Home
