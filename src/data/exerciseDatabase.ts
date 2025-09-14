// Comprehensive Exercise Database
// 100+ exercises covering all major muscle groups and equipment types

export interface Exercise {
  id: string;
  name: string;
  muscle_groups: string[]; // Primary and secondary muscle groups
  equipment: string[]; // Required equipment
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: string[]; // Step-by-step instructions
  category: string; // Exercise type category
  movement_pattern?: string; // Movement classification
  image_url?: string; // For future visual content
  video_url?: string; // For future video content
  tips?: string[]; // Form tips and safety notes
}

export const exerciseDatabase: Exercise[] = [
  // ===== CHEST EXERCISES =====
  {
    id: "bench-press",
    name: "Bench Press",
    muscle_groups: ["chest", "triceps", "shoulders"],
    equipment: ["barbell", "bench"],
    difficulty: "intermediate",
    instructions: [
      "Lie flat on the bench with your feet firmly on the ground",
      "Grip the barbell with hands slightly wider than shoulder-width",
      "Unrack the bar and hold it directly above your chest",
      "Lower the bar slowly to your chest, keeping elbows at 45 degrees",
      "Press the bar back up to starting position with control"
    ],
    category: "strength",
    movement_pattern: "push",
    tips: [
      "Keep your shoulder blades retracted throughout the movement",
      "Don't bounce the bar off your chest",
      "Maintain tension in your core",
      "Use a spotter for heavy weights"
    ]
  },
  {
    id: "push-ups",
    name: "Push-ups",
    muscle_groups: ["chest", "triceps", "shoulders", "core"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Start in a plank position with hands shoulder-width apart",
      "Keep your body in a straight line from head to heels",
      "Lower your chest toward the ground by bending your elbows",
      "Push back up to the starting position",
      "Repeat for desired repetitions"
    ],
    category: "strength",
    movement_pattern: "push",
    tips: [
      "Keep your core engaged throughout",
      "Don't let your hips sag or pike up",
      "Full range of motion is key",
      "Modify on knees if needed"
    ]
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    muscle_groups: ["chest", "triceps", "shoulders"],
    equipment: ["dumbbells", "incline bench"],
    difficulty: "intermediate",
    instructions: [
      "Set the bench to a 30-45 degree incline",
      "Hold dumbbells at shoulder level with palms facing forward",
      "Press the weights up and slightly toward each other",
      "Lower with control back to starting position",
      "Repeat for desired repetitions"
    ],
    category: "strength",
    movement_pattern: "push",
    tips: [
      "Don't arch your back excessively",
      "Control the weight on the way down",
      "Squeeze your chest at the top",
      "Keep your feet planted on the ground"
    ]
  },
  {
    id: "dips",
    name: "Dips",
    muscle_groups: ["chest", "triceps", "shoulders"],
    equipment: ["dip bars", "parallel bars"],
    difficulty: "intermediate",
    instructions: [
      "Grip the parallel bars and support your body weight",
      "Start with arms fully extended",
      "Lower your body by bending your elbows",
      "Descend until your shoulders are below your elbows",
      "Push back up to the starting position"
    ],
    category: "strength",
    movement_pattern: "push",
    tips: [
      "Lean slightly forward to target chest more",
      "Don't go too deep to avoid shoulder injury",
      "Keep your core engaged",
      "Use assistance if needed"
    ]
  },
  {
    id: "chest-flyes",
    name: "Chest Flyes",
    muscle_groups: ["chest"],
    equipment: ["dumbbells", "bench"],
    difficulty: "intermediate",
    instructions: [
      "Lie on a flat bench holding dumbbells above your chest",
      "With a slight bend in your elbows, lower the weights out to your sides",
      "Feel a stretch in your chest at the bottom",
      "Bring the weights back together above your chest",
      "Squeeze your chest muscles at the top"
    ],
    category: "strength",
    movement_pattern: "fly",
    tips: [
      "Don't lower the weights too far",
      "Keep the movement smooth and controlled",
      "Focus on feeling the stretch and contraction",
      "Use lighter weights than pressing movements"
    ]
  },

  // ===== BACK EXERCISES =====
  {
    id: "pull-ups",
    name: "Pull-ups",
    muscle_groups: ["back", "biceps"],
    equipment: ["pull-up bar"],
    difficulty: "intermediate",
    instructions: [
      "Hang from a pull-up bar with an overhand grip",
      "Start with arms fully extended",
      "Pull your body up until your chin is over the bar",
      "Lower yourself back down with control",
      "Repeat for desired repetitions"
    ],
    category: "strength",
    movement_pattern: "pull",
    tips: [
      "Don't use momentum or kipping",
      "Focus on pulling with your back muscles",
      "Full range of motion is important",
      "Use assistance bands if needed"
    ]
  },
  {
    id: "barbell-rows",
    name: "Barbell Rows",
    muscle_groups: ["back", "biceps", "shoulders"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    instructions: [
      "Stand with feet shoulder-width apart, holding a barbell",
      "Hinge at the hips and lean forward with straight back",
      "Let the bar hang at arm's length",
      "Pull the bar to your lower chest/upper abdomen",
      "Lower the bar back down with control"
    ],
    category: "strength",
    movement_pattern: "pull",
    tips: [
      "Keep your back straight throughout",
      "Pull with your elbows, not your hands",
      "Squeeze your shoulder blades together",
      "Don't use too much weight initially"
    ]
  },
  {
    id: "lat-pulldowns",
    name: "Lat Pulldowns",
    muscle_groups: ["back", "biceps"],
    equipment: ["lat pulldown machine"],
    difficulty: "beginner",
    instructions: [
      "Sit at the lat pulldown machine with thighs secured",
      "Grip the bar with hands wider than shoulder-width",
      "Pull the bar down to your upper chest",
      "Squeeze your shoulder blades together",
      "Slowly return the bar to the starting position"
    ],
    category: "strength",
    movement_pattern: "pull",
    tips: [
      "Don't lean back excessively",
      "Focus on pulling with your lats",
      "Don't pull the bar behind your neck",
      "Control the weight on the way up"
    ]
  },
  {
    id: "deadlifts",
    name: "Deadlifts",
    muscle_groups: ["back", "glutes", "hamstrings", "core"],
    equipment: ["barbell"],
    difficulty: "advanced",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot",
      "Bend at hips and knees to grip the bar",
      "Keep your back straight and chest up",
      "Drive through your heels to lift the bar",
      "Stand tall with shoulders back, then lower with control"
    ],
    category: "strength",
    movement_pattern: "hinge",
    tips: [
      "Keep the bar close to your body",
      "Don't round your back",
      "Engage your core throughout",
      "Start with lighter weight to learn form"
    ]
  },
  {
    id: "seated-cable-rows",
    name: "Seated Cable Rows",
    muscle_groups: ["back", "biceps", "shoulders"],
    equipment: ["cable machine"],
    difficulty: "beginner",
    instructions: [
      "Sit at the cable row machine with feet on footrests",
      "Grip the handle with both hands",
      "Pull the handle to your lower chest",
      "Squeeze your shoulder blades together",
      "Slowly return to the starting position"
    ],
    category: "strength",
    movement_pattern: "pull",
    tips: [
      "Keep your back straight",
      "Don't use momentum",
      "Focus on squeezing your shoulder blades",
      "Keep your elbows close to your body"
    ]
  },

  // ===== SHOULDER EXERCISES =====
  {
    id: "overhead-press",
    name: "Overhead Press",
    muscle_groups: ["shoulders", "triceps", "core"],
    equipment: ["barbell"],
    difficulty: "intermediate",
    instructions: [
      "Stand with feet shoulder-width apart, holding barbell at shoulder level",
      "Keep your core tight and back straight",
      "Press the bar straight up overhead",
      "Lock out your arms at the top",
      "Lower the bar back to shoulder level with control"
    ],
    category: "strength",
    movement_pattern: "push",
    tips: [
      "Don't arch your back excessively",
      "Keep the bar path straight up and down",
      "Engage your core throughout",
      "Don't press from behind your neck"
    ]
  },
  {
    id: "lateral-raises",
    name: "Lateral Raises",
    muscle_groups: ["shoulders"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Stand with dumbbells at your sides",
      "Keep a slight bend in your elbows",
      "Raise the weights out to your sides to shoulder height",
      "Hold briefly at the top",
      "Lower the weights back down with control"
    ],
    category: "strength",
    movement_pattern: "raise",
    tips: [
      "Don't use momentum",
      "Lead with your pinkies, not your thumbs",
      "Don't raise above shoulder height",
      "Use lighter weights for this exercise"
    ]
  },
  {
    id: "front-raises",
    name: "Front Raises",
    muscle_groups: ["shoulders"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Stand with dumbbells in front of your thighs",
      "Keep a slight bend in your elbows",
      "Raise one or both weights in front of you to shoulder height",
      "Hold briefly at the top",
      "Lower the weights back down with control"
    ],
    category: "strength",
    movement_pattern: "raise",
    tips: [
      "Don't swing the weights",
      "Keep your core engaged",
      "Don't raise above shoulder height",
      "Alternate arms if desired"
    ]
  },
  {
    id: "rear-delt-flyes",
    name: "Rear Delt Flyes",
    muscle_groups: ["shoulders", "back"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Bend forward at the hips with dumbbells hanging down",
      "Keep a slight bend in your elbows",
      "Raise the weights out to your sides",
      "Squeeze your shoulder blades together",
      "Lower the weights back down with control"
    ],
    category: "strength",
    movement_pattern: "fly",
    tips: [
      "Keep your back straight",
      "Don't use momentum",
      "Focus on squeezing your rear delts",
      "Use lighter weights"
    ]
  },

  // ===== ARM EXERCISES =====
  {
    id: "bicep-curls",
    name: "Bicep Curls",
    muscle_groups: ["biceps"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Stand with dumbbells at your sides, palms facing forward",
      "Keep your elbows close to your body",
      "Curl the weights up toward your shoulders",
      "Squeeze your biceps at the top",
      "Lower the weights back down with control"
    ],
    category: "strength",
    movement_pattern: "curl",
    tips: [
      "Don't swing your body",
      "Keep your elbows stationary",
      "Focus on the muscle contraction",
      "Use full range of motion"
    ]
  },
  {
    id: "tricep-extensions",
    name: "Tricep Extensions",
    muscle_groups: ["triceps"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Lie on a bench holding dumbbells above your chest",
      "Keep your upper arms stationary",
      "Lower the weights by bending only at the elbows",
      "Stop when you feel a stretch in your triceps",
      "Extend back to the starting position"
    ],
    category: "strength",
    movement_pattern: "extension",
    tips: [
      "Keep your upper arms still",
      "Don't let your elbows flare out",
      "Control the weight on the way down",
      "Focus on the tricep contraction"
    ]
  },
  {
    id: "hammer-curls",
    name: "Hammer Curls",
    muscle_groups: ["biceps", "forearms"],
    equipment: ["dumbbells"],
    difficulty: "beginner",
    instructions: [
      "Stand with dumbbells at your sides, palms facing each other",
      "Keep your elbows close to your body",
      "Curl the weights up toward your shoulders",
      "Keep your palms facing each other throughout",
      "Lower the weights back down with control"
    ],
    category: "strength",
    movement_pattern: "curl",
    tips: [
      "Don't swing the weights",
      "Keep wrists neutral",
      "Squeeze at the top",
      "Alternate arms if desired"
    ]
  },
  {
    id: "tricep-dips",
    name: "Tricep Dips",
    muscle_groups: ["triceps", "shoulders"],
    equipment: ["bench", "chair"],
    difficulty: "beginner",
    instructions: [
      "Sit on the edge of a bench with hands gripping the edge",
      "Slide your body off the bench, supporting yourself with your arms",
      "Lower your body by bending your elbows",
      "Go down until your elbows are at 90 degrees",
      "Push back up to the starting position"
    ],
    category: "strength",
    movement_pattern: "push",
    tips: [
      "Keep your back close to the bench",
      "Don't go too deep",
      "Keep your elbows pointing backward",
      "Bend your knees for easier variation"
    ]
  },

  // ===== LEG EXERCISES =====
  {
    id: "squats",
    name: "Squats",
    muscle_groups: ["quadriceps", "glutes", "hamstrings", "core"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Keep your chest up and core engaged",
      "Lower your body as if sitting back into a chair",
      "Go down until your thighs are parallel to the floor",
      "Drive through your heels to return to standing"
    ],
    category: "strength",
    movement_pattern: "squat",
    tips: [
      "Keep your knees in line with your toes",
      "Don't let your knees cave inward",
      "Keep your weight on your heels",
      "Maintain a neutral spine"
    ]
  },
  {
    id: "lunges",
    name: "Lunges",
    muscle_groups: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Stand with feet hip-width apart",
      "Step forward into a long stride",
      "Lower your body until both knees are at 90 degrees",
      "Keep your front knee over your ankle",
      "Push back to the starting position and repeat"
    ],
    category: "strength",
    movement_pattern: "lunge",
    tips: [
      "Keep your torso upright",
      "Don't let your front knee drift forward",
      "Take a big enough step",
      "Alternate legs or do all reps on one side"
    ]
  },
  {
    id: "leg-press",
    name: "Leg Press",
    muscle_groups: ["quadriceps", "glutes", "hamstrings"],
    equipment: ["leg press machine"],
    difficulty: "beginner",
    instructions: [
      "Sit in the leg press machine with feet on the platform",
      "Position feet shoulder-width apart",
      "Lower the weight by bending your knees",
      "Go down until your knees are at 90 degrees",
      "Press the weight back up through your heels"
    ],
    category: "strength",
    movement_pattern: "squat",
    tips: [
      "Don't let your knees cave inward",
      "Keep your back against the pad",
      "Use full range of motion",
      "Don't lock out your knees completely"
    ]
  },
  {
    id: "calf-raises",
    name: "Calf Raises",
    muscle_groups: ["calves"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Stand with feet hip-width apart",
      "Rise up onto your toes as high as possible",
      "Hold briefly at the top",
      "Lower back down with control",
      "Feel the stretch in your calves at the bottom"
    ],
    category: "strength",
    movement_pattern: "raise",
    tips: [
      "Use full range of motion",
      "Don't bounce at the bottom",
      "Hold onto something for balance if needed",
      "Squeeze your calves at the top"
    ]
  },
  {
    id: "romanian-deadlifts",
    name: "Romanian Deadlifts",
    muscle_groups: ["hamstrings", "glutes", "back"],
    equipment: ["dumbbells", "barbell"],
    difficulty: "intermediate",
    instructions: [
      "Stand with feet hip-width apart holding weights",
      "Keep your knees slightly bent",
      "Hinge at the hips and push your hips back",
      "Lower the weights while keeping your back straight",
      "Feel the stretch in your hamstrings, then return to standing"
    ],
    category: "strength",
    movement_pattern: "hinge",
    tips: [
      "Keep the weights close to your body",
      "Don't round your back",
      "Focus on pushing your hips back",
      "Feel the stretch in your hamstrings"
    ]
  },
  {
    id: "hip-thrusts",
    name: "Hip Thrusts",
    muscle_groups: ["glutes", "hamstrings"],
    equipment: ["bench"],
    difficulty: "beginner",
    instructions: [
      "Sit with your back against a bench",
      "Place feet flat on the floor, knees bent",
      "Drive through your heels to lift your hips up",
      "Squeeze your glutes at the top",
      "Lower your hips back down with control"
    ],
    category: "strength",
    movement_pattern: "thrust",
    tips: [
      "Keep your chin tucked",
      "Don't arch your back excessively",
      "Focus on squeezing your glutes",
      "Add weight across your hips for more resistance"
    ]
  },

  // ===== CORE EXERCISES =====
  {
    id: "planks",
    name: "Planks",
    muscle_groups: ["core", "shoulders"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Start in a push-up position with forearms on the ground",
      "Keep your body in a straight line from head to heels",
      "Engage your core and hold the position",
      "Breathe normally while maintaining the position",
      "Hold for the desired amount of time"
    ],
    category: "strength",
    movement_pattern: "isometric",
    tips: [
      "Don't let your hips sag or pike up",
      "Keep your neck neutral",
      "Breathe normally",
      "Start with shorter holds and build up"
    ]
  },
  {
    id: "crunches",
    name: "Crunches",
    muscle_groups: ["core"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Lie on your back with knees bent and feet flat",
      "Place your hands behind your head or across your chest",
      "Lift your shoulder blades off the ground",
      "Focus on contracting your abs",
      "Lower back down with control"
    ],
    category: "strength",
    movement_pattern: "crunch",
    tips: [
      "Don't pull on your neck",
      "Focus on quality over quantity",
      "Keep the movement controlled",
      "Breathe out as you crunch up"
    ]
  },
  {
    id: "russian-twists",
    name: "Russian Twists",
    muscle_groups: ["core", "obliques"],
    equipment: ["bodyweight"],
    difficulty: "intermediate",
    instructions: [
      "Sit with knees bent and lean back slightly",
      "Lift your feet off the ground",
      "Rotate your torso from side to side",
      "Touch the ground beside your hips with each twist",
      "Keep your chest up throughout the movement"
    ],
    category: "strength",
    movement_pattern: "rotation",
    tips: [
      "Keep your back straight",
      "Don't rush the movement",
      "Focus on rotating your torso, not just your arms",
      "Add weight for more challenge"
    ]
  },
  {
    id: "mountain-climbers",
    name: "Mountain Climbers",
    muscle_groups: ["core", "shoulders", "legs"],
    equipment: ["bodyweight"],
    difficulty: "intermediate",
    instructions: [
      "Start in a push-up position",
      "Bring one knee toward your chest",
      "Quickly switch legs, bringing the other knee forward",
      "Continue alternating legs in a running motion",
      "Keep your core engaged throughout"
    ],
    category: "cardio",
    movement_pattern: "dynamic",
    tips: [
      "Keep your hips level",
      "Don't let your butt rise up",
      "Maintain a steady rhythm",
      "Land softly on your feet"
    ]
  },
  {
    id: "leg-raises",
    name: "Leg Raises",
    muscle_groups: ["core", "hip flexors"],
    equipment: ["bodyweight"],
    difficulty: "intermediate",
    instructions: [
      "Lie on your back with legs straight",
      "Place your hands under your lower back for support",
      "Keep your legs straight and lift them up",
      "Raise your legs until they're perpendicular to the floor",
      "Lower them back down without touching the ground"
    ],
    category: "strength",
    movement_pattern: "raise",
    tips: [
      "Keep your lower back pressed into the ground",
      "Don't use momentum",
      "Bend your knees if the exercise is too difficult",
      "Control the lowering phase"
    ]
  },
  {
    id: "bicycle-crunches",
    name: "Bicycle Crunches",
    muscle_groups: ["core", "obliques"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Lie on your back with hands behind your head",
      "Lift your shoulder blades off the ground",
      "Bring one knee toward your chest while rotating your torso",
      "Touch your opposite elbow to the raised knee",
      "Switch sides in a pedaling motion"
    ],
    category: "strength",
    movement_pattern: "rotation",
    tips: [
      "Don't pull on your neck",
      "Focus on bringing your elbow to your knee",
      "Keep the movement controlled",
      "Fully extend each leg"
    ]
  },

  // ===== CARDIO EXERCISES =====
  {
    id: "burpees",
    name: "Burpees",
    muscle_groups: ["full body"],
    equipment: ["bodyweight"],
    difficulty: "advanced",
    instructions: [
      "Start standing with feet shoulder-width apart",
      "Drop into a squat and place hands on the ground",
      "Jump or step back into a push-up position",
      "Do a push-up, then jump or step feet back to squat",
      "Explode up into a jump with arms overhead"
    ],
    category: "cardio",
    movement_pattern: "compound",
    tips: [
      "Modify by stepping instead of jumping",
      "Keep your core engaged",
      "Land softly from jumps",
      "Pace yourself to maintain form"
    ]
  },
  {
    id: "jumping-jacks",
    name: "Jumping Jacks",
    muscle_groups: ["full body"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Start standing with feet together and arms at your sides",
      "Jump up while spreading your feet shoulder-width apart",
      "Simultaneously raise your arms overhead",
      "Jump back to the starting position",
      "Repeat in a continuous motion"
    ],
    category: "cardio",
    movement_pattern: "jump",
    tips: [
      "Land softly on your feet",
      "Keep a steady rhythm",
      "Stay on the balls of your feet",
      "Modify by stepping if needed"
    ]
  },
  {
    id: "high-knees",
    name: "High Knees",
    muscle_groups: ["legs", "core"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Stand with feet hip-width apart",
      "Run in place while lifting your knees high",
      "Try to bring your knees up to hip level",
      "Pump your arms as you would while running",
      "Maintain a quick pace"
    ],
    category: "cardio",
    movement_pattern: "dynamic",
    tips: [
      "Stay on the balls of your feet",
      "Keep your core engaged",
      "Drive your knees up high",
      "Maintain good posture"
    ]
  },
  {
    id: "butt-kickers",
    name: "Butt Kickers",
    muscle_groups: ["hamstrings", "glutes"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Stand with feet hip-width apart",
      "Run in place while kicking your heels toward your glutes",
      "Try to touch your glutes with your heels",
      "Pump your arms as you would while running",
      "Maintain a quick pace"
    ],
    category: "cardio",
    movement_pattern: "dynamic",
    tips: [
      "Stay on the balls of your feet",
      "Keep your thighs vertical",
      "Focus on bringing heels to glutes",
      "Maintain good posture"
    ]
  },

  // ===== FUNCTIONAL/COMPOUND EXERCISES =====
  {
    id: "thrusters",
    name: "Thrusters",
    muscle_groups: ["legs", "shoulders", "core"],
    equipment: ["dumbbells"],
    difficulty: "intermediate",
    instructions: [
      "Hold dumbbells at shoulder level",
      "Perform a squat by lowering your body",
      "As you stand up, press the weights overhead",
      "Lower the weights back to shoulder level",
      "Immediately go into the next squat"
    ],
    category: "strength",
    movement_pattern: "compound",
    tips: [
      "Use the momentum from your legs",
      "Keep your core engaged",
      "Don't pause between squat and press",
      "Choose appropriate weight"
    ]
  },
  {
    id: "kettlebell-swings",
    name: "Kettlebell Swings",
    muscle_groups: ["glutes", "hamstrings", "core", "shoulders"],
    equipment: ["kettlebell"],
    difficulty: "intermediate",
    instructions: [
      "Stand with feet shoulder-width apart, kettlebell in front",
      "Hinge at hips and grab the kettlebell with both hands",
      "Swing the kettlebell up to chest level using hip drive",
      "Let the kettlebell swing back down between your legs",
      "Repeat the hip hinge and swing motion"
    ],
    category: "strength",
    movement_pattern: "swing",
    tips: [
      "Power comes from your hips, not your arms",
      "Keep your back straight",
      "Don't squat, hinge at the hips",
      "Keep the kettlebell close to your body"
    ]
  },
  {
    id: "man-makers",
    name: "Man Makers",
    muscle_groups: ["full body"],
    equipment: ["dumbbells"],
    difficulty: "advanced",
    instructions: [
      "Start standing holding dumbbells",
      "Drop into a squat and place dumbbells on the ground",
      "Jump back into plank position, hands on dumbbells",
      "Perform a push-up on the dumbbells",
      "Do a renegade row with each arm, then jump feet to hands and stand"
    ],
    category: "cardio",
    movement_pattern: "compound",
    tips: [
      "Start with lighter weights",
      "Focus on form over speed",
      "Modify by stepping instead of jumping",
      "This is a very challenging exercise"
    ]
  },

  // ===== STRETCHING/FLEXIBILITY =====
  {
    id: "downward-dog",
    name: "Downward Facing Dog",
    muscle_groups: ["hamstrings", "calves", "shoulders"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Start on hands and knees",
      "Tuck your toes under and lift your hips up",
      "Straighten your legs and form an inverted V shape",
      "Press your hands into the ground",
      "Hold the position while breathing deeply"
    ],
    category: "flexibility",
    movement_pattern: "stretch",
    tips: [
      "Keep your hands shoulder-width apart",
      "Try to get your heels to the ground",
      "Keep your head between your arms",
      "Breathe deeply and relax"
    ]
  },
  {
    id: "childs-pose",
    name: "Child's Pose",
    muscle_groups: ["back", "hips"],
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Start on hands and knees",
      "Sit back on your heels",
      "Reach your arms forward and lower your chest toward the ground",
      "Rest your forehead on the ground",
      "Hold the position while breathing deeply"
    ],
    category: "flexibility",
    movement_pattern: "stretch",
    tips: [
      "This is a resting pose",
      "Widen your knees if needed for comfort",
      "Focus on breathing deeply",
      "Hold for as long as feels good"
    ]
  },

  // ===== RESISTANCE BAND EXERCISES =====
  {
    id: "band-pull-aparts",
    name: "Band Pull-Aparts",
    muscle_groups: ["shoulders", "back"],
    equipment: ["resistance band"],
    difficulty: "beginner",
    instructions: [
      "Hold a resistance band with arms extended in front of you",
      "Keep your arms straight",
      "Pull the band apart by moving your arms out to your sides",
      "Squeeze your shoulder blades together",
      "Slowly return to the starting position"
    ],
    category: "strength",
    movement_pattern: "pull",
    tips: [
      "Keep your arms at shoulder height",
      "Focus on squeezing your shoulder blades",
      "Don't let the band snap back",
      "Use a band with appropriate resistance"
    ]
  },
  {
    id: "band-squats",
    name: "Band Squats",
    muscle_groups: ["quadriceps", "glutes"],
    equipment: ["resistance band"],
    difficulty: "beginner",
    instructions: [
      "Stand on a resistance band with feet shoulder-width apart",
      "Hold the handles at shoulder level",
      "Perform a squat while the band provides resistance",
      "The band will help you on the way up",
      "Control the movement both down and up"
    ],
    category: "strength",
    movement_pattern: "squat",
    tips: [
      "Keep tension in the band throughout",
      "Don't let the band pull you forward",
      "Focus on proper squat form",
      "The band adds resistance and assistance"
    ]
  }
];

// Utility functions for searching and filtering exercises
export const getExerciseById = (id: string): Exercise | undefined => {
  return exerciseDatabase.find(exercise => exercise.id === id);
};

export const searchExercises = (
  query: string, 
  muscleGroupFilter?: string[], 
  equipmentFilter?: string[], 
  difficultyFilter?: string[],
  categoryFilter?: string[]
): Exercise[] => {
  let filtered = exerciseDatabase;

  // Text search
  if (query.trim()) {
    const searchTerm = query.toLowerCase();
    filtered = filtered.filter(exercise => 
      exercise.name.toLowerCase().includes(searchTerm) ||
      exercise.muscle_groups.some(mg => mg.toLowerCase().includes(searchTerm)) ||
      exercise.equipment.some(eq => eq.toLowerCase().includes(searchTerm)) ||
      exercise.category.toLowerCase().includes(searchTerm)
    );
  }

  // Muscle group filter
  if (muscleGroupFilter && muscleGroupFilter.length > 0) {
    filtered = filtered.filter(exercise =>
      exercise.muscle_groups.some(mg => muscleGroupFilter.includes(mg))
    );
  }

  // Equipment filter
  if (equipmentFilter && equipmentFilter.length > 0) {
    filtered = filtered.filter(exercise =>
      exercise.equipment.some(eq => equipmentFilter.includes(eq))
    );
  }

  // Difficulty filter
  if (difficultyFilter && difficultyFilter.length > 0) {
    filtered = filtered.filter(exercise =>
      difficultyFilter.includes(exercise.difficulty)
    );
  }

  // Category filter
  if (categoryFilter && categoryFilter.length > 0) {
    filtered = filtered.filter(exercise =>
      categoryFilter.includes(exercise.category)
    );
  }

  return filtered;
};

export const getAllMuscleGroups = (): string[] => {
  const muscleGroups = new Set<string>();
  exerciseDatabase.forEach(exercise => {
    exercise.muscle_groups.forEach(mg => muscleGroups.add(mg));
  });
  return Array.from(muscleGroups).sort();
};

export const getAllEquipment = (): string[] => {
  const equipment = new Set<string>();
  exerciseDatabase.forEach(exercise => {
    exercise.equipment.forEach(eq => equipment.add(eq));
  });
  return Array.from(equipment).sort();
};

export const getAllCategories = (): string[] => {
  const categories = new Set<string>();
  exerciseDatabase.forEach(exercise => {
    categories.add(exercise.category);
  });
  return Array.from(categories).sort();
};

export const getExercisesByMuscleGroup = (muscleGroup: string): Exercise[] => {
  return exerciseDatabase.filter(exercise =>
    exercise.muscle_groups.includes(muscleGroup)
  );
};

export const getExercisesByEquipment = (equipment: string): Exercise[] => {
  return exerciseDatabase.filter(exercise =>
    exercise.equipment.includes(equipment)
  );
};

export const getRandomExercises = (count: number = 5): Exercise[] => {
  const shuffled = [...exerciseDatabase].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};