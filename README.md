# Transmission

An endless physics-based 2D snowboarding game built with TypeScript.

## Play

The game will be live on deno deploy soon!
<!-- [Play Transmission](https://your-deployment-url.com) (if deployed) -->

### Game Controls

- **W / D**: Control snowboarder rotation
- **Left / Right Arrowkeys** Control your shoulders / shifty angle
- **Spacebar**: Jump
- **R** Restart

## Tech Used

The game primarily uses [Deno](https://deno.land/) and [PixiJS](https://pixijs.com/) for the runtime and rendering engine respectively. 

The project also uses [Fresh](https://fresh.deno.dev/) (Deno's full-stack web framework) & Tailwind CSS. These are not used as extensivley, as most things are done client side within the the Pixi application. 

## Getting Started

### Prerequisites
- [Deno](https://deno.land/manual/getting_started/installation) installed

### Installation & Running
Clone the repository

```bash
git clone https://github.com/MartinAllsbrook/transmission.git
cd transmission
```

Start the development server

```bash
deno task dev
# Or
deno task start
```

The game will be available at `http://localhost:8000`

### Project Structure

The main entrypoint for the game is at `islands/game.tsx`

Most of the logic is in `/src`, with the base `GameObject` class and many of the classes that extend from it being in the `/src/objects` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

