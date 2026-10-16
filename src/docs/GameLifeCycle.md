# Ponderam — Game Lifecycle Rules

## 1. Creating a game
- A game is created by a host.
- A game can be public or private.
- Public games can appear in the public lobby. Private games are joined using a game code.
- Players who join enter the waiting room.
- The maximum player count includes the host.

## 2. Starting a game
A game can begin its countdown in either of two ways:
1. The host requests to start the game.
2. The room reaches its maximum player capacity.

The backend must ensure that only one countdown is active for a game.

## 3. The 10-second countdown
- The backend owns the countdown and its start time.
- All connected participants see the same countdown.
- Participants may join or disconnect while the countdown is running, subject to the room's capacity and state.
- At zero, the backend performs the final connectivity checks.

## 4. Final connectivity checks
At countdown completion, the backend must:

1. Identify connected participants using the current connection-presence state.
2. Remove participants who are disconnected.
3. If the host is disconnected, assign host ownership to the earliest-joined connected participant.
4. Notify the replacement host: "You're now the host of this room."
5. Check the number of connected participants remaining.

There is no additional grace period after the countdown ends.

## 5. Minimum players
At least two connected participants, including the host, are required to start.

If fewer than two participants remain, the game must not start. The room should be cancelled and archived if no viable game remains.

## 6. Starting successfully
If the final checks pass, the backend must:
- Confirm that the game has not already started or been cancelled.
- Lock the participant list.
- Record the game start time.
- Initialise the game timer using the configured duration.
- Notify connected participants that the game has started.

The start operation must be atomic so that simultaneous requests cannot start the same game twice.

## 7. Leaving and disconnection
These are different events.

**Explicit host departure before the game starts**
- Cancel the waiting room.
- Archive the game and its current details.
- Notify the remaining participants that the room has been cancelled.

**Temporary network disconnection**
- Do not automatically cancel the room.
- Keep the room available during the countdown.
- Apply the final connectivity checks when the countdown ends.

## 8. Empty rooms
If no connected participants remain at the final check, cancel and archive the room. It must not become an active game.

## 9. Repository responsibilities
The game repository and backend must own:
- Countdown initiation and completion.
- Connection checks and participant removal.
- Host reassignment.
- Room cancellation and archiving.
- Atomic game-start transitions.
- Live game-state updates and notifications.

The frontend displays the state received from the backend. It must not independently decide who is connected or whether the game has started.
