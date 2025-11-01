import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

// Image generation
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '32px',
          boxShadow: '0 10px 40px rgba(59, 130, 246, 0.3)',
        }}
      >
        {/* Video Play Icon with Sparkles */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          {/* Main Play Icon */}
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 5.14v13.72L19 12L8 5.14z"
              fill="white"
              stroke="white"
              strokeWidth="0.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          {/* Sparkle 1 */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              width: '12px',
              height: '12px',
              background: 'white',
              borderRadius: '50%',
              opacity: 0.8,
            }}
          />
          
          {/* Sparkle 2 */}
          <div
            style={{
              position: 'absolute',
              bottom: '15px',
              left: '15px',
              width: '8px',
              height: '8px',
              background: 'white',
              borderRadius: '50%',
              opacity: 0.6,
            }}
          />
          
          {/* Sparkle 3 */}
          <div
            style={{
              position: 'absolute',
              top: '25px',
              left: '20px',
              width: '6px',
              height: '6px',
              background: 'white',
              borderRadius: '50%',
              opacity: 0.7,
            }}
          />
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}