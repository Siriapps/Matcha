import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/Layout'

function BrewResults() {
  const navigate = useNavigate()
  const [brewResults, setBrewResults] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [matches, setMatches] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Load results from sessionStorage on mount
  useEffect(() => {
    const storedResults = sessionStorage.getItem('brew_results')

    if (!storedResults) {
      // No results found, redirect to dashboard
      navigate('/dashboard')
      return
    }

    try {
      const results = JSON.parse(storedResults)
      setBrewResults(results)
      setCurrentUser(results.current_user || null)
      setMatches(results.matches || [])
    } catch (error) {
      console.error('Failed to parse brew results:', error)
      navigate('/dashboard')
    }
  }, [navigate])

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a search query')
      return
    }

    setIsSearching(true)

    try {
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

      const response = await fetch(`${API_BASE_URL}/search-teammates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          hackathon: brewResults.hackathon_name,
          search_query: searchQuery,
          current_user_id: currentUser?.participant_id
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to search teammates')
      }

      const result = await response.json()
      setMatches(result.matches || [])
    } catch (error) {
      console.error('Search error:', error)
      alert(`Search failed: ${error.message}`)
    } finally {
      setIsSearching(false)
    }
  }

  const handleChat = (brewerId, brewerName) => {
    navigate(`/messages?user=${brewerId}&name=${encodeURIComponent(brewerName)}`)
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col bg-background-dark">
        <main className="flex-1 w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8">
          {/* Page Header */}
          <div className="flex flex-col gap-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">
                  Your <span className="text-primary">Brew</span> Results
                </h2>
                {brewResults && (
                  <p className="text-[#9db9a6] text-lg max-w-2xl">
                    We found <span className="text-white font-bold">{matches.length} {matches.length === 1 ? 'brewer' : 'brewers'}</span> for <span className="text-white border-b border-primary/50">{brewResults.hackathon_name || 'this hackathon'}</span> ({brewResults.total_participants || 0} total participants).
                  </p>
                )}
              </div>
              {/* AI Search Bar */}
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="E.g., I'm looking for someone strong with Python and has built multiple projects..."
                    className="w-full px-4 py-3 bg-[#1e3626] border border-[#28392e] rounded-lg text-white placeholder-[#9db9a6] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    disabled={isSearching}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[#9db9a6] text-[20px]">
                    psychology
                  </span>
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-lg hover:bg-[#0fd650] transition-colors font-bold text-sm shadow-[0_0_15px_rgba(19,236,91,0.3)] disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSearching ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                      Searching...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">search</span>
                      AI Search
                    </>
                  )}
                </button>
              </div>
            </div>
            {/* Divider */}
            <div className="border-b border-[#28392e]"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Results Feed (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {matches.length > 0 ? (
                <>
                  {matches.map((match, idx) => (
                    <article
                      key={idx}
                      className="group relative flex flex-col sm:flex-row gap-0 sm:gap-6 rounded-xl bg-surface-dark border border-[#28392e] p-5 shadow-lg transition hover:border-primary/30 hover:shadow-[0_0_20px_rgba(19,236,91,0.05)]"
                    >
                      {/* Match Badge */}
                      <div className={`absolute -top-3 -right-3 z-10 flex h-14 w-14 flex-col items-center justify-center rounded-full bg-[#102216] border-2 ${match.match_score >= 90 ? 'border-primary' : 'border-[#1e3626]'} shadow-lg`}>
                        <span className={`text-xs font-bold ${match.match_score >= 90 ? 'text-primary' : 'text-white'}`}>{match.match_score}%</span>
                        <span className={`text-[10px] ${match.match_score >= 90 ? 'text-primary/80' : 'text-gray-400'} uppercase tracking-tighter`}>Match</span>
                      </div>
                      {/* Avatar Side */}
                      <div className="flex-shrink-0 w-full sm:w-48 h-48 sm:h-auto relative rounded-lg overflow-hidden bg-gray-800 mb-4 sm:mb-0">
                        <img
                          alt={`Portrait of ${match.name}`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          src={match.photo_url || 'https://via.placeholder.com/400x400?text=No+Image'}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <div className="flex items-center gap-1 text-xs font-medium text-white">
                            <span className="material-symbols-outlined text-[14px] text-primary">location_on</span>
                            {match.location || 'Location not specified'}
                          </div>
                        </div>
                      </div>
                      {/* Content Side */}
                      <div className="flex flex-1 flex-col justify-between gap-4">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{match.name}</h3>
                              <p className="text-[#9db9a6] text-sm font-medium">{match.role || 'Hackathon Participant'}</p>
                            </div>
                          </div>

                          {/* AI Match Reasoning */}
                          {match.match_reason && (
                            <div className="mt-3 p-3 bg-[#102216] border border-primary/20 rounded-lg">
                              <div className="flex items-start gap-2">
                                <span className="material-symbols-outlined text-primary text-[16px] mt-0.5">psychology</span>
                                <p className="text-sm text-gray-300 flex-1">{match.match_reason}</p>
                              </div>
                            </div>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            {(match.skills || []).map((skill, skillIdx) => (
                              <span key={skillIdx} className="inline-flex items-center rounded bg-[#1e3626] px-2 py-1 text-xs font-medium text-white ring-1 ring-inset ring-white/10">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Action Bar */}
                        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/5 mt-2">
                          <button className="flex-1 min-w-[120px] bg-primary hover:bg-[#0fd650] text-black font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-all transform active:scale-95">
                            <span className="material-symbols-outlined text-[18px]">handshake</span>
                            Request
                          </button>
                          <button
                            onClick={() => handleChat(match.profile_url || idx, match.name)}
                            className="flex-1 min-w-[100px] bg-[#28392e] hover:bg-[#344a3b] text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors border border-transparent hover:border-white/10"
                          >
                            <span className="material-symbols-outlined text-[18px]">chat</span>
                            Chat
                          </button>
                          {match.profile_url && (
                            <a
                              href={match.profile_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full sm:w-auto bg-transparent border border-primary/30 hover:border-primary hover:bg-primary/10 text-primary font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 text-sm transition-colors"
                              title="View Devpost Profile"
                            >
                              <span className="material-symbols-outlined text-[18px]">person</span>
                              <span className="sr-only sm:not-sr-only">Profile</span>
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 px-6 bg-surface-dark border border-[#28392e] rounded-xl">
                  <span className="material-symbols-outlined text-[#9db9a6] text-6xl mb-4">sentiment_dissatisfied</span>
                  <h3 className="text-xl font-bold text-white mb-2">No matches found</h3>
                  <p className="text-[#9db9a6] text-center max-w-md">
                    We couldn't find any compatible teammates for this hackathon. Try brewing again later or adjust your profile.
                  </p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="mt-6 px-6 py-3 bg-primary text-black rounded-lg font-bold hover:bg-[#0fd650] transition-colors"
                  >
                    Back to Dashboard
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Sidebar (4 cols) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Rules Card */}
              <div className="rounded-xl bg-surface-dark border border-[#28392e] p-6 shadow-lg sticky top-24">
                <div className="flex items-center gap-2 mb-6 border-b border-[#28392e] pb-4">
                  <span className="material-symbols-outlined text-primary">gavel</span>
                  <h3 className="text-lg font-bold text-white">Hackathon Rules</h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">1</div>
                    <div className="space-y-1">
                      <p className="text-white text-sm font-bold">No Pre-written Code</p>
                      <p className="text-xs text-[#9db9a6]">All code must be written during the event. Libraries and frameworks are allowed.</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">2</div>
                    <div className="space-y-1">
                      <p className="text-white text-sm font-bold">Team Size Limit</p>
                      <p className="text-xs text-[#9db9a6]">Teams must be between 2 to 4 members. Solo participants can be matched here.</p>
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold mt-0.5">3</div>
                    <div className="space-y-1">
                      <p className="text-white text-sm font-bold">Submission Deadline</p>
                      <p className="text-xs text-[#9db9a6]">All projects must be submitted to DevPost by Sunday, 12:00 PM EST.</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-6 pt-4 border-t border-[#28392e]">
                  <h4 className="text-sm font-bold text-white mb-2">Event Status</h4>
                  <div className="w-full bg-[#102216] rounded-full h-2 mb-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '35%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-[#9db9a6]">
                    <span>Kickoff</span>
                    <span>Judging</span>
                  </div>
                </div>
              </div>
              {/* Promo Card */}
              <div className="rounded-xl bg-gradient-to-br from-[#1e3626] to-[#102216] border border-[#28392e] p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Need Inspiration?</h3>
                  <span className="material-symbols-outlined text-yellow-400">emoji_objects</span>
                </div>
                <p className="text-sm text-[#9db9a6] mb-4">
                  Use our AI idea generator to find a project that fits your team's skill stack.
                </p>
                <button className="w-full py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold transition-colors">
                  Launch Idea Generator
                </button>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </Layout>
  )
}

export default BrewResults
