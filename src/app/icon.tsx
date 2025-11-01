import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

// Image generation
export default function Icon() {
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
          borderRadius: '8px',
          position: 'relative',
        }}
      >
        {/* Main Play Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 5.14v13.72L19 12L8 5.14z"
              fill="white"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          {/* Small sparkle */}
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '4px',
              height: '4px',
              background: 'white',
              borderRadius: '50%',
              opacity: 0.9,
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