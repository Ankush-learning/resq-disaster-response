import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)
  const followerRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    const follower = followerRef.current
    if (!cursor || !follower) return

    let mouseX = 0, mouseY = 0
    let followerX = 0, followerY = 0
    let raf = null

    const onMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`
    }

    const animate = () => {
      followerX += (mouseX - followerX) * 0.12
      followerY += (mouseY - followerY) * 0.12
      follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(animate)
    }

    // Hover state on clickable elements
    const onEnter = () => {
      cursor.style.width = '20px'
      cursor.style.height = '20px'
      follower.style.width = '50px'
      follower.style.height = '50px'
      follower.style.borderColor = 'rgba(34, 211, 238, 0.8)'
    }
    const onLeave = () => {
      cursor.style.width = '12px'
      cursor.style.height = '12px'
      follower.style.width = '36px'
      follower.style.height = '36px'
      follower.style.borderColor = 'rgba(34, 211, 238, 0.5)'
    }

    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button, [role="button"]').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    raf = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={followerRef} className="cursor-follower" />
    </>
  )
}
