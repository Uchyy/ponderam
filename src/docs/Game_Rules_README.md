# Ponderam Multiplayer Game Rules

**Status:** Agreed game rules\
**Scope:** Multiplayer room lifecycle, gameplay, submissions, peer
marking, host responsibilities, reliability, and fallback handling.

This document defines how a Ponderam multiplayer game operates. The
server is authoritative for game state, timers, participant eligibility,
submissions, marking assignments, scoring, and reliability changes.

## 1. Core rules

1.  A game follows the same defined lifecycle for all participants.
2.  The server decides when each phase starts and ends.
3.  Valid submissions and marks are preserved.
4.  If a player leaves or fails to complete assigned marking, unfinished
    marking work is reassigned so eligible players are not left without
    a marking outcome.
5.  Marking obligations are part of participating in a game. Missing an
    assigned obligation affects reliability.
6.  Reliability is earned through completed obligations and reduced by
    missed obligations.
7.  A game must not rely on a departed player to finish.

## 2. Game lifecycle

A multiplayer game follows these phases:

1.  Waiting room
2.  Start countdown and room lock
3.  Final participant check
4.  Gameplay
5.  Submission period
6.  Peer marking
7.  Results
8.  Archive

The server controls transitions between these phases.

## 3. Waiting room and access

-   Each game has a seven-character room code.
-   Public waiting games can be discovered through the public-game list.
-   Private games are accessible only to authorised participants.
    Knowing the room code alone does not grant permission to read
    private game data.
-   Players must be authenticated and have a completed profile to create
    or join a game.
-   Players may join a public waiting game if it is not full.
-   Players may join a private game using its code only if the server
    authorises them.
-   Full rooms reject additional players.
-   Repeated join requests from the same player do not create duplicate
    participant entries.
-   Players may leave while the room is waiting.
-   The host may cancel a game only before gameplay starts.
-   If the host leaves before gameplay starts, host ownership transfers
    to an eligible connected participant rather than automatically
    cancelling the game.

## 4. Start countdown and locking the room

-   When the host starts the countdown, the room locks.
-   No new players may join after the countdown begins.
-   The server records the countdown start and end times.
-   Players in the room receive an in-app update that the countdown has
    started. A phone notification may also be sent when notifications
    are permitted.
-   The game does not depend on notification delivery for correctness.
-   The server checks participant availability at the defined countdown
    checkpoints; it does not require continuous heartbeat monitoring to
    determine whether someone is still present for the start.
-   At the end of the start countdown, the server checks which
    participants are available to enter gameplay.
-   The minimum number of players required to start a game is **three**.
-   If fewer than three eligible players remain, the game does not start
    and is closed and archived.
-   If at least three eligible players remain, the server fixes the
    gameplay participant list and starts the game.
-   If the host is not available at the check, host ownership transfers
    to an eligible participant who is available.

## 5. Host ownership and transfer

-   The host is responsible for starting the game and managing the
    waiting room.
-   The host may cancel the game only before gameplay starts.
-   Once gameplay starts, the host cannot cancel the game.
-   If the host leaves or becomes unavailable, host ownership transfers
    to an eligible remaining participant.
-   The server records the new host and ensures that only one
    participant owns host privileges at a time.
-   Host transfer does not restart the game, reset timers, remove valid
    submissions, or erase completed marks.
-   The new host inherits the remaining host responsibilities, including
    receiving priority for reassigned marking work.
-   If only one player remains during gameplay, that player may finish
    the game. They receive a **+10 reliability reward** for completing
    the game when everyone else has left. The game then follows the
    normal result and archive process, with the one-player outcome
    recorded.
-   There is no separate reliability punishment merely for leaving
    during gameplay. Reliability penalties apply to missed marking
    obligations.

## 6. Gameplay

-   Gameplay lasts for the duration selected in the game details.
-   The server controls the gameplay timer.
-   When gameplay time expires, answer entry closes and the game moves
    to the submission period.
-   A client cannot extend the timer by changing the device clock.
-   The gameplay participant list is established when the game starts.
    Players who leave during gameplay are recorded as having left and
    are excluded from later eligibility as defined by the game rules.
-   Leaving during gameplay, by itself, does not create a missed-marking
    penalty. A reliability penalty applies if the player fails an
    assigned marking obligation.

## 7. Submission period

-   A separate submission period follows gameplay.
-   The submission period has its own server-controlled countdown.
-   The planned submission period is a short, fixed window; its exact
    duration is configurable and is not specified in this rules
    document.
-   Eligible players must submit their answers before the submission
    deadline.
-   When the deadline expires, the server finalises submissions
    automatically.
-   A player who has not submitted by the deadline has their submission
    finalised with the answers received so far; unanswered or empty
    categories count as wrong answers.
-   An answer that does not begin with the selected letter is a wrong
    answer.
-   Empty answers are wrong answers.
-   The server does not accept late edits after submissions are
    finalised.
-   After submission finalisation, the server checks which players
    remain eligible for marking.
-   A player who has left before marking begins is excluded from the
    marking pool, and their submission and score are excluded
    completely.
-   Marking assignments are then calculated from the remaining eligible
    players.

## 8. Peer marking

### 8.1 Normal assignment

-   Players mark other players' submissions, never their own.
-   The server creates and stores marking assignments.
-   In a three-player cycle, for example, A marks B, B marks C, and C
    marks A.
-   Assignment logic must support the player counts allowed by the game
    and must not create self-marking assignments.

### 8.2 Valid marks

-   A valid mark is saved when the server accepts it.
-   Completed valid marks remain saved if the marker later leaves.
-   The same marking obligation must not be counted as completed more
    than once.
-   Marking criteria are applied consistently to the submitted answers.
-   Empty answers and answers that do not begin with the selected letter
    are wrong answers.

### 8.3 If a player leaves before marking begins

-   Their submission and score are excluded completely.
-   The remaining eligible players are reassigned so eligible
    submissions can be marked.
-   The departing player is not penalised for a marking obligation they
    were never assigned.

### 8.4 If a player leaves during marking or does not finish

-   Completed valid marks remain recorded.
-   The player's unfinished marking responsibilities are reassigned.
-   Reassignment protects the player whose submission needs marking, but
    does not erase the original marker's missed obligation.
-   The server records the missed obligation and applies the reliability
    deduction once the deadline confirms it was missed.
-   The game continues for the remaining eligible participants when
    possible.

### 8.5 Marking fallback and host priority

When marking work must be reassigned:

1.  Preserve valid marks already submitted.
2.  Identify unfinished marking assignments.
3.  Assign the extra work to the current host first, if the host is
    eligible and is not being assigned their own submission.
4.  If the host cannot take an assignment, assign it to another eligible
    player who has not marked that submission.
5.  Repeat until all required work is assigned or no eligible marker
    remains.

-   Reassignment may cause a player to mark more than one submission.
-   A player must never mark their own submission.
-   If the host has left, the current host after ownership transfer
    receives priority.
-   The server records each assignment and reassignment so it can
    prevent duplicate work and reliability adjustments.

### 8.6 Marking timer expires

-   The marking phase has a separate server-controlled countdown.
-   When a marker leaves or fails to finish before the deadline,
    unfinished work is reassigned using the host-priority fallback.
-   The system first attempts reassignment; it does not discard
    completed marks.
-   The game does not treat missing marks as valid marks.
-   If no eligible marker remains to complete outstanding work, the game
    records the unresolved marking state and follows the scoring and
    archive process with the incomplete work explicitly recorded. The
    game must not remain open indefinitely.

## 9. Reliability score and fair play

Reliability measures whether a player fulfils marking obligations.

### 9.1 Reliability values

  Event                                   Reliability change
  ------------------------------------- --------------------
  Starting score for every new player                     70
  Completes a marking obligation                          +5
  Misses a marking obligation                            -10
  Minimum score                                            0
  Maximum score                                          150
  Public-game restriction threshold                 Below 40
  Public-game restriction duration                   30 days

Reliability is clamped between 0 and 150. A score of 100 or more is a
positive signal that a player has built a reliable record.

### 9.2 Reliability adjustments

-   A player earns +5 when an assigned marking obligation is completed
    and accepted by the server.
-   A player loses 10 when an assigned marking obligation is not
    completed by the deadline.
-   Each obligation affects reliability only once.
-   Reassigning unfinished work does not remove the original marker's
    missed obligation.
-   Leaving before receiving a marking assignment does not itself count
    as a missed marking obligation.
-   Leaving during gameplay does not itself trigger a reliability
    penalty; failing to fulfil an assigned marking obligation does.
-   The server checks saved marks before recording a missed obligation,
    so a successfully saved mark is not penalised merely because a
    confirmation was not received by the client.
-   The server, not the client, calculates and stores reliability
    changes.
-   Completed obligations may raise reliability up to the maximum of
    150; missed obligations may reduce it down to the minimum of 0.

### 9.3 Public-game restriction

-   When a player's reliability falls below 40, the player is banned
    from joining public games for 30 days.
-   The restriction is based on server-stored reliability and
    restriction timestamps.
-   The restriction expires after 30 days.
-   The initial restriction applies to public games. It does not
    automatically ban the player from private games.
-   The system records the restriction and its reason.
-   A later feature may show reliability in waiting rooms and allow
    hosts to remove players from their rooms. This is a future
    enhancement; it does not change the current restriction rule.

## 10. Results and archiving

-   When marking is complete, the server calculates results from valid
    submissions and valid marks.
-   If marking work cannot be completed because no eligible marker
    remains, the unresolved state is recorded and the result is handled
    according to the incomplete-marking rule.
-   A game with fewer than three eligible players at the end of the
    start countdown does not start; it is closed and archived.
-   A game in which everyone leaves except one player during gameplay
    may be finished by that remaining player, who receives the +10
    reliability reward.
-   Finished and cancelled games are archived and treated as read-only.
-   The archive records the final status and an appropriate reason, such
    as completed, insufficient players, or cancelled before gameplay.
-   The host may cancel only before gameplay starts. Once gameplay has
    started, the host cannot cancel the game.

## 11. Security and authoritative enforcement

The Supabase implementation must enforce these rules rather than relying
on the user interface alone.

-   Only authenticated users with completed profiles may create or join
    games.
-   Private room codes do not bypass access control.
-   Only authorised participants can read private game data.
-   The server validates the current game phase before accepting joins,
    submissions, marks, cancellation, and completion.
-   The server owns timer deadlines and phase transitions.
-   Clients cannot set their own reliability, ban status, game result,
    or another player's marks.
-   Duplicate joins, marks, reliability adjustments, and reassignment
    operations must be prevented.
-   Realtime subscriptions must respect access controls.
-   Archived games cannot be modified through normal client actions.
-   Host transfer must be atomic so that only one host exists at a time.

## 12. Operational sequence

For implementation and testing, the expected sequence is:

1.  Create the room and add eligible participants.
2.  Host starts the countdown.
3.  Lock the room and notify participants.
4.  At countdown end, check participant availability and require at
    least three players.
5.  Transfer host ownership if the original host is unavailable.
6.  Start gameplay and run the server-controlled gameplay timer.
7.  Close gameplay and start the separate submission timer.
8.  At submission deadline, finalise submitted answers; treat empty and
    invalid-letter answers as wrong.
9.  Exclude players who left before marking begins and remove their
    submissions and scores from the eligible game.
10. Create peer-marking assignments for eligible submissions.
11. Run the marking timer.
12. Save valid marks as they arrive.
13. If a player leaves or misses the deadline, record the missed
    obligation and reassign unfinished work, giving the current host
    priority.
14. Apply reliability changes once per completed or missed obligation.
15. Apply a 30-day public-game ban if reliability falls below 40.
16. Calculate the result, record any unresolved marking state, and
    archive the game.

------------------------------------------------------------------------

## Summary

Ponderam multiplayer is a server-controlled, time-limited peer-marking
game. The room locks when the start countdown begins, at least three
eligible players are required to start, and a separate submission period
follows gameplay. Players must mark assigned submissions by the
deadline. Valid marks are preserved, unfinished assignments are
reassigned with the host receiving priority, and missed marking
obligations affect reliability.

Every new player starts at 70 reliability. Completed marking obligations
add 5; missed obligations subtract 10. Reliability ranges from 0 to 150.
A score below 40 triggers a 30-day ban from public games. Leaving during
gameplay does not itself incur a reliability penalty, but failing an
assigned marking obligation does.
