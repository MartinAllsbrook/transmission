import { Assets, Particle, ParticleContainer } from "pixi.js";
import { GameObject, GameRoot, TransformOptions, } from "framework";

interface SnowParticle {
    particle: Particle;
    phaseOffset: number;
}

export class SnowParticles extends GameObject {
    public override get Name(): string {
        return "SnowParticles";
    }
    public override get layer(): string {
        return "snow";
    }

    private particles: SnowParticle[] = [];
    private size: number;

    constructor(
        parent: GameObject | GameRoot,
        root: GameRoot,
        chunkSize: number,
        transformOptions?: TransformOptions,
    ) {
        super(parent, root, transformOptions);

        this.size = chunkSize;
    }

    protected override async start(): Promise<void> {
        // Create a particle container with default options
        const container = new ParticleContainer({
            dynamicProperties: {
                position: true, // Allow dynamic position changes (default)
                scale: false, // Static scale for extra performance
                rotation: false, // Static rotation
                color: false, // Static color
            },
        });

        // Add particles
        const texture = await Assets.load("/Snowflake.png");

        // Check if destroyed during async asset loading
        if (this.Destroyed) return;

        for (let i = 0; i < 100; ++i) {
            const particle = new Particle({
                texture,
                x: Math.random() * this.size,
                y: Math.random() * this.size,
            });

            const snowParticle: SnowParticle = {
                particle,
                phaseOffset: Math.random() * Math.PI * 2, // Random phase offset between 0 and 2π
            };

            this.particles.push(snowParticle);

            container.addParticle(particle);
        }

        // Add container to the Pixi stage
        this.addGraphics(container);
    }

    public override update(_deltaTime: number): void {
        const time = Date.now() / 1000;

        for (const snowParticle of this.particles) {
            const a = time + snowParticle.phaseOffset;
            snowParticle.particle.x += (Math.cos(a)) * 0.1;
            snowParticle.particle.y -= 2 * (Math.sin(2 * a)) * 0.1;
        }
    }
}
