import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'

function Dashboard() {
  const navigate = useNavigate()
  const { user, updateProfile } = useAuth()
  const [hackathonUrl, setHackathonUrl] = useState('')

  useEffect(() => {
    // Load user's devpost link if available
    if (user?.devpostLink) {
      // Could pre-fill hackathon URL if needed
    }
  }, [user])

  const handleFindTeammates = () => {
    if (hackathonUrl.trim()) {
      // Pass hackathon URL to brewing page via state
      navigate('/brewing', { state: { hackathonUrl } })
    } else {
      alert('Please enter a hackathon URL')
    }
  }

  const displayName = user?.name || user?.email?.split('@')[0] || 'User'
  const firstName = displayName.split(' ')[0]
  const userTitle = user?.title || 'Full Stack Dev'

  const hackHistory = [
    {
      month: 'Oct 2023',
      event: 'HackMIT 2023',
      title: 'Project Nebula',
      description: 'An AI-powered tool for real-time sign language translation using computer vision.',
      status: 'Finalist',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQhx-mZBrAIkswhpVGIh9EzWtKVsOAwEqFz3GVYqiIJnlvhwAjNYARMfCL2m4nOXeAjH70ZKPrpRSwmh8Omg40pd4xicCZc1jYoMCQ2bcbaJbzk-UV7b2cKLKBqIPAlKlgOpPyEzxpC8nXkKLFqvJKSa66ZRDwTGJmQax2DH7d0r_HhEzsbGrL3qE35SUcKLc9JwnnxrnZEKcZ8xvvPRVoGXaNS11eYp2TfjyHUHSu5ZPJlzf_7OJtL8yfk0iiYOKCx6ihH5OxO2s',
      team: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAQGCm9X_fvg03c9sxlJNYDL1NlZTf4jmKZBdlfMwZJpl95kxSP5R-6ZXKrM1k0j3oLbfzC96scS9CyATxaV9-xG5kZWmy7wooUfeclMRjPLG4iEQmIji5yfPr1a4Zp9M0TY_rC_31XF9LvHjbLJU0LEywZg9p5Oj8_O2qYgwGYqScBiYMCCczuh-b8UOM7hmo8XlJfCeNJBNBOBYfflSbzAgkK7zP2-ebLfNTn10EclxdyI6lSytd_RxgrYZljNmzhpOKWV95D10k',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDwxDalhzlsPYCwfyyROYjwhP62hkCA7A4KBCRCGAhVJbvjKfJe4BTpazejLE9M4sYyE80jv1wI_2g4tTFAtIYxsxIve6eOs45s97Yif5LEuM4czASkQjWTwMWEkU65PBu8_3S74T5ME043D7e6R8qffeNtH4SqxFekUYkMlo5wdkxQaIaAZkW70d7Vl5-qW2TAy7jGY5ZZP6W3wMM6lF33UD1R-1EvyR-1kiDVGD8F8Vav40unHffa5_48YcR_7gS_AuOOZRikhTg',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBxMZrRBgkMAmcrbLP19oCyBuyzmWFNzSleAp9uMUCLWBX87_0T7rJ8az_KDd9dSJ8uWKYLCW3jl7Dn6J24RbjRjlHccNB5ZCHv7eFf0xxDYaWFC_V3ROLnFvsqO6NXHPrenhv8ozCLA_iHbeDwNR8n7N_nxp1L5q2_zyBUakGbxWohXuVBjooXV_UKRQmkxBq_jBGIYK6KjLgaow7a4EuWto9EUbw1ESMjxTKtw2WZpid-e4yUh5dgagb1JmCIUevK9eyW8TkzeGI',
      ]
    },
    {
      month: 'Aug 2023',
      event: 'ETHGlobal NY',
      title: 'ChainGuard',
      description: 'Decentralized identity verification protocol for secure voting systems.',
      status: 'Completed',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvEuy9LMAdJJ-4HapqmTklFP_UI6K_EqIvF_95YaRMvJHFvS03hc3bD0wxYo8RxCsXaSKmTN68xSZo1hCnjEVhivkeNNwazPPndDLw0q75xK1ecJQIwP_Nh4knL20zlNwqIGoEy5I8GWeiKHtHxz7ivYPsXj7V-q39q2NnzHWrEpqfzRUX3WZcoPUdqBrlRZZPhLGj26OTVqbW1ezXRzmhdFXKQ_vlcilYWsHEBQB450ts7OuZlf1sUiFa3NLzDlEGSa5QtxqP9yU',
      team: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDRj4VIrCFxAIzlXkhxP2EaedO3O8J059vVsZ_BmJtyfA_8lic0lKlqSHYkx0cz_9M3cN76P509-ly_YB_yKMoQH_AkyjhTU7NxAKuh_pXmV_zA0zJAI1hRjG3MDTIriK2hsDYW5sbW3jcAZWhMBmzRYOzdGnhhR81CK6V-J0ntTHyaj9F1ivzCsHKWHtni0fqpv4JCZhxeJVHCuVs7roTpIKwe_RI6AOyQHLkOu1qaKm6MLsz3N6wGLOF9s7-Hu7WZ_nggp4oUIno',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCUD6E6vYldoOljU-Xmd0zos0iUhJlXbPFPM6cFnUwm4WQHM9pMxQzsmv8do_4wRyzrMtv4lh3KQ1vT4jWYbjEQrOEFQ3eX2A7BVVivuQuNR-EOdZiGnzsEYGxrmU7cHylzNwEa8uRvPBDavRPcGzptZDdEsjoayr3oJ7WU22trdxK1Oz_7vMqXWYy5MEXFoKj7SkVJrdqaKNk9y5TVDH4VWGHuW3yYpY8n-uKkRpi0Elu5oWhu7EPIVjljpqQlcw4KApDKSAB3a8I',
      ]
    },
    {
      month: 'Jun 2023',
      event: 'HackTheNorth',
      title: 'EcoTrack',
      description: 'Mobile app tracking carbon footprint from grocery receipts via OCR.',
      status: 'Matching',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcuNUuZRcHINU4mIx15OSeVDYoM-g4mmEfUZs3kTWzAX9BenOycOMOnAKuzdkcWef5qmLg0D2_2cGLPi647bFIIw2qHab5BoTniqJDkEVUcizLn6RjY6ZsXdYcHhVlpX9gsNBp2x47AfZxJvDgBViTcKGCgTfJCLPoMj05MuWLTxJon_CJOmHj4bQVI7yV6sFD4EwnPGwAx2S3FDCPQ0R1YJy4kzJWkH1lFBNQ-XbwU8ahlMV_xkYlwCdj5q2fjLfs13YFIOwFSVg',
      team: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAfhu4oTQ7AO1IdPXmRhL1Z4kvsHGXtTAJHssRF5XQSye_WDNpbuseMS4A9vz9XnNo8b0Nvti1UPOxbrQRj7QcfP8PxF2NcIzrGAFz7lwp99uhEUwVveuza5uo3q0Br-CfbxVYOKND71nd3G-QqcKsJw3ioqUf0GkFnHtaq5vU9kqZWcSCjnbVdWP7l6rMrpiVefJDSrdLDvvCqd18L2qSo84OQ7H0xok-U_ozqdrtSvu1h9uwAeTuwGaY4Rhj7541EOXuWoEbgKJI',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBZKHP6pgswMFa3W8tqF2fJMKBvZhzgGSeyAaCxKL-7MKylv1RM7LRHIpOBug_n_teZ5xSieV04L6ETkMYO9SRrpTnmGKQCuuCG8vYfE7Hy-zsJpFaMiriyuE75AIStcqzS-1Lh0zd5KOcu9a5Yi2VOKGZyC5Fl4Q8ZmP0TBA-l0cvO9PM5lZZbR1uTaXCQQ_ICAZ3gForPmpFvCQ9gciwUD6ybTLZ9w5OOEaufoqoo7yx50nPdp0seyQw63V53tNp9iqe_bhikqYE',
      ],
      extraMembers: 1
    },
  ]

  return (
    <Layout>
      <div className="flex flex-1 flex-col p-6 lg:p-10 gap-8 max-w-7xl mx-auto w-full bg-gradient-to-br from-background-dark via-[#0d1a12] to-background-dark">
        {/* Welcome Section */}
        <section className="flex flex-col gap-2">
          <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-[-0.033em] text-white">
            Welcome back, {firstName} <span className="text-primary">.</span>
          </h1>
          <p className="text-text-secondary text-base lg:text-lg">Ready to brew some code today?</p>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="group flex flex-col justify-between rounded-xl border border-[#3b5443] bg-surface-dark p-6 transition-all hover:border-primary/50">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#28392e] text-primary group-hover:bg-primary group-hover:text-[#111813] transition-colors">
              <span className="material-symbols-outlined">code</span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Total Hackathons</p>
              <p className="mt-1 text-3xl font-bold text-white">12</p>
            </div>
          </div>
          <div className="group flex flex-col justify-between rounded-xl border border-[#3b5443] bg-surface-dark p-6 transition-all hover:border-primary/50">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#28392e] text-primary group-hover:bg-primary group-hover:text-[#111813] transition-colors">
              <span className="material-symbols-outlined">handshake</span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Teams Formed</p>
              <p className="mt-1 text-3xl font-bold text-white">8</p>
            </div>
          </div>
          <div className="group flex flex-col justify-between rounded-xl border border-[#3b5443] bg-surface-dark p-6 transition-all hover:border-primary/50">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-[#28392e] text-primary group-hover:bg-primary group-hover:text-[#111813] transition-colors">
              <span className="material-symbols-outlined">mail</span>
            </div>
            <div>
              <p className="text-sm font-medium text-text-secondary">Pending Invites</p>
              <p className="mt-1 text-3xl font-bold text-white">2</p>
            </div>
          </div>
        </section>

        {/* Hero / Find Teammates */}
        <section className="relative overflow-hidden rounded-2xl bg-[#18261e] border border-[#28392e]">
          {/* Abstract Background Pattern */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#13ec5b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
          <div className="relative flex flex-col items-center justify-center px-4 py-12 text-center lg:py-16">
            <div className="mb-6 rounded-full bg-primary/10 p-3 ring-1 ring-primary/30">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: '32px' }}>rocket_launch</span>
            </div>
            <h2 className="mb-3 max-w-2xl text-2xl font-bold text-white lg:text-3xl">Ready to brew a new project?</h2>
            <p className="mb-8 max-w-lg text-text-secondary">Paste a Devpost or hackathon URL below to instantly start the matching process with compatible teammates.</p>
            <div className="w-full max-w-xl">
              <div className="flex flex-col sm:flex-row shadow-lg rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={hackathonUrl}
                  onChange={(e) => setHackathonUrl(e.target.value)}
                  placeholder="Paste hackathon URL (e.g. devpost.com/...)"
                  className="flex-1 border-0 bg-[#28392e] px-6 py-4 text-white placeholder-text-secondary focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <button
                  onClick={handleFindTeammates}
                  className="bg-primary px-8 py-4 text-base font-bold text-[#111813] hover:bg-[#10c94d] transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-xl">search</span>
                  Find Teammates
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Past Brews / History */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-white tracking-tight">Your Hack History</h3>
            <Link to="#" className="text-sm font-medium text-primary hover:text-white transition-colors flex items-center gap-1">
              View All <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {hackHistory.map((hack, idx) => (
              <div
                key={idx}
                className="group relative flex flex-col overflow-hidden rounded-xl border border-[#28392e] bg-[#18261e] transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
              >
                <div
                  className="h-32 w-full bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundImage: `url("${hack.image}")` }}
                >
                  <div className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm border border-white/10">
                    {hack.month}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-primary">{hack.event}</div>
                  <h4 className="mb-2 text-lg font-bold text-white">{hack.title}</h4>
                  <p className="mb-4 flex-1 text-sm text-text-secondary">{hack.description}</p>
                  <div className="flex items-center justify-between border-t border-[#28392e] pt-4">
                    <div className="flex -space-x-2">
                      {hack.team.map((member, i) => (
                        <div
                          key={i}
                          className="h-8 w-8 rounded-full border-2 border-[#18261e] bg-gray-600 bg-cover bg-center"
                          style={{ backgroundImage: `url("${member}")` }}
                        />
                      ))}
                      {hack.extraMembers && (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-[#18261e] bg-[#28392e] text-[10px] font-bold text-white">
                          +{hack.extraMembers}
                        </div>
                      )}
                    </div>
                    <span className="rounded-full bg-[#28392e] px-2 py-1 text-xs font-medium text-white">{hack.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default Dashboard
