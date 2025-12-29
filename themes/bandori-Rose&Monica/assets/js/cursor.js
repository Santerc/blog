document.addEventListener('click', function(e) {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
    createParticles(e.clientX, e.clientY, color);
});

function createParticles(x, y, color) {
    const particleCount = 12; // 粒子数量
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('click-particle');
        document.body.appendChild(particle);
        
        // 随机扩散方向
        const destinationX = (Math.random() - 0.5) * 100;
        const destinationY = (Math.random() - 0.5) * 100;
        
        // 随机大小和旋转
        const size = Math.random() * 6 + 4; // 4px ~ 10px
        const rotation = Math.random() * 520;

        particle.style.backgroundColor = color;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.transform = `rotate(${rotation}deg)`;
        
        // 执行动画
        const animation = particle.animate([
            {
                transform: `translate(0, 0) rotate(0deg)`,
                opacity: 1
            },
            {
                transform: `translate(${destinationX}px, ${destinationY}px) rotate(${rotation}deg)`,
                opacity: 0
            }
        ], {
            duration: 800 + Math.random() * 200, // 800ms ~ 1000ms
            easing: 'cubic-bezier(0, .9, .57, 1)',
            fill: 'forwards'
        });

        // 动画结束后清理 DOM
        animation.onfinish = () => {
            particle.remove();
        };
    }
}
