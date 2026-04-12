'use client'

import { useState } from 'react'
import { vote } from '@/lib/api'

function fmt(n, cur = 'LKR') {
  if (!n && n !== 0) return '—'
  return cur === 'LKR'
    ? 'LKR ' + Number(n).toLocaleString()
    : cur + ' ' + Number(n).toLocaleString()
}

export default function SalaryCard({ salary }) {
  const [upvotes,   setUpvotes]   = useState(salary.upvotes   || 0)
  const [downvotes, setDownvotes] = useState(salary.downvotes || 0)
  const [voted, setVoted]         = useState(null)
  const [voteError, setVoteError] = useState(null)

  const handleVote = async (type) => {
    if (!localStorage.getItem('token')) { window.location.href = '/login'; return }
    if (voted) return
    try {
      await vote(salary.id, type)
      if (type === 'up')   setUpvotes(v => v + 1)
      if (type === 'down') setDownvotes(v => v + 1)
      setVoted(type)
    } catch (e) {
      setVoteError(e.message)
    }
  }

  return (
    <div className="card hover:border-brand-200 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900">{salary.role}</h3>
            <span className="badge-approved">Approved</span>
            {salary.level && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                {salary.level}
              </span>
            )}
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm text-gray-500 flex-wrap">
            {!salary.anonymize && salary.company && <span>{salary.company}</span>}
            {salary.location && <span>{salary.location}</span>}
            {salary.years_of_experience !== undefined && (
              <span>{salary.years_of_experience} yr{salary.years_of_experience !== 1 ? 's' : ''} exp</span>
            )}
          </div>
          {salary.tech_stack && (
            <p className="mt-2 text-xs text-gray-400">{salary.tech_stack}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-brand-700">
            {fmt(salary.salary_amount, salary.currency)}
          </p>
          <p className="text-xs text-gray-400">per month</p>
        </div>
      </div>

      {/* Vote row */}
      <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
        <button onClick={() => handleVote('up')}
          className={"flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors " +
            (voted === 'up'
              ? 'bg-green-50 border-green-300 text-green-700'
              : 'border-gray-200 text-gray-500 hover:border-green-300 hover:text-green-600')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
          {upvotes}
        </button>

        <button onClick={() => handleVote('down')}
          className={"flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg border transition-colors " +
            (voted === 'down'
              ? 'bg-red-50 border-red-300 text-red-700'
              : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600')}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
          {downvotes}
        </button>

        {voted && <span className="text-xs text-gray-400">Thanks for voting!</span>}
        {voteError && <span className="text-xs text-red-500">{voteError}</span>}
      </div>
    </div>
  )
}
