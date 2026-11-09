# Super Mario Bros. — World 1-1 Recreation

A single-player side-scrolling platformer that recreates World 1-1 of Super Mario Bros. (NES, 1985) faithfully in look, sound and feel. Nothing outside World 1-1 is in scope.

## Language

**Reference Version** (原版):
NES / Famicom *Super Mario Bros.*, 1985. Every claim of fidelity points at this release and no other.
_Avoid_: All-Stars, Deluxe, Super Mario 64

**World 1-1** (第一关):
The one level in scope: overworld, its hidden elements, flagpole and castle sequence. No World Map, no other levels.
_Avoid_: Level 1, Stage 1, the first level

**Accuracy** (复刻):
Matching the Reference Version's data and feel — tile layout, enemy placement, sprite shapes, music, movement constants. Explicitly _not_ emulating NES hardware.
_Avoid_: pixel-perfect (used vaguely), 1:1

**Mario** (马里奥):
The player-controlled character. Exists in exactly one of three states: Small, Super, Fire.
_Avoid_: the player, hero

**Small / Super / Fire** (形态):
Mario's states. Small is the starting state; Super is one hitpoint taller; Fire adds the ability to throw Fireballs. Losing a hit from Super or Fire returns Mario to Small, and Small dies.
_Avoid_: power-up level, size

**Power-up** (道具):
An item Mario collects that changes his state, grants a Life, or makes him briefly unkillable by contact. In World 1-1: Super Mushroom, Fire Flower, 1-Up Mushroom, Starman.
_Avoid_: pickup, bonus, Magic Mushroom

**Fire Flower** (火焰花):
The Power-up that puts Mario into Fire and enables Fireballs.
_Avoid_: fireball flower, flame flower

**Starman** (无敌星):
The Power-up that makes Mario temporarily immune to contact damage and kill Enemies on touch.
_Avoid_: invincibility star, star

**Fireball** (火球):
The bouncing projectile Mario throws while in Fire.
_Avoid_: bullet, fire

**Tile** (瓦片):
The smallest unit of level geometry. Everything static is a Tile.
_Avoid_: cell, grid square

**Block** (方块):
A Tile with behaviour: Brick Block (breakable by Super/Fire, solid otherwise), Question Block (yields something when hit from below), Hidden Block (invisible until hit).
_Avoid_: box, crate, question mark

**Ground** (地面):
The walkable solid Tile. Distinguish from a Block: Ground has no behaviour.
_Avoid_: floor, platform (reserve platform for raised solid sections)

**Pipe** (水管):
A raised green Tile column. Either decorative, or enterable if the Reference Version lets Mario enter it at that spot.
_Avoid_: tube, warp

**Bonus Area** (金币密室):
The underground room reached by the enterable Pipe, holding Coins and ending at an exit Pipe near the level's end. Taking it skips most of the overworld.
_Avoid_: coin room, warp zone

**Pit** (坑洞):
A gap in the Ground where falling below the screen kills Mario regardless of state.
_Avoid_: hole, gap

**Enemy** (敌人):
A moving entity that damages Mario on contact from the side or below. Defeated by a Stomp, a Fireball, or being crushed by a falling Block.
_Avoid_: mob, monster

**Goomba** (栗子怪):
A Mushroom-shaped Enemy that walks and dies from a Stomp without bouncing Mario.
_Avoid_: chestnut, mushroom enemy

**Koopa Troopa** (库巴龟):
A walking Enemy that survives a Stomp as a Shell, which is then kicked and kills other Enemies it hits.
_Avoid_: turtle, koopa

**Shell** (龟壳):
What a Koopa Troopa becomes after a Stomp. Slides when kicked, and damages Mario on contact unless Mario is riding it.

**Stomp** (踩踏):
Defeating an Enemy by landing on it from above.
_Avoid_: jump-kill, squash

**Coin** (金币):
A collectible worth one to the Coin count; 100 Coins grant one extra Life.
_Avoid_: money

**Score** (分数):
Points from Coins, Enemies and Actions. Distinct from Coin count: Coins count towards an extra Life, Score does not.
_Avoid_: points (as a synonym for Coins)

**Time Limit** (剩余时间):
Seconds remaining to finish the level. Reaching zero kills Mario. The count races faster below 100 and is then the Hurry Up phase.
_Avoid_: clock, timer (as a variable name is fine, but say Time Limit when naming the concept)

**Life** (命):
A unit of continuation. Running out causes Game Over.
_Avoid_: HP, health (health is the state lost by a hit within one Life)

**Game Over** (游戏结束):
All Lives lost: the attempt ends and restarts at the start of World 1-1.
_Avoid_: you lose, reset

**Flagpole** (旗杆):
The goal at the end of World 1-1. Touching it ends the level; how high Mario lands scores bonus points.
_Avoid_: goal, finish line

**Castle** (城堡):
Where Mario walks after the Flagpole. Reaching it triggers Fireworks.
_Avoid_: fort, palace

**Fireworks** (烟花):
The end-of-level display after reaching the Castle. The last thing this project does.
_Avoid_: confetti
