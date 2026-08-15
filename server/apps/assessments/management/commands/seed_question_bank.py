"""
Seeds a real, demo-ready question bank: Python, SQL, and Docker, each with
beginner/intermediate/advanced pools of 5 questions apiece (45 total).

Idempotent - safe to run multiple times. Uses get_or_create throughout, so
re-running after a DB reset (or mid-demo) won't create duplicates or error out.

Usage:
    python manage.py seed_question_bank
"""
from django.core.management.base import BaseCommand
from django.db import transaction

from apps.competencies.models import Skill
from apps.assessments.models import Assessment, Question


# ---------------------------------------------------------------------------
# Question data. Each entry: (text, question_type, options, correct_answer, points)
# Grading is exact-match (case-insensitive) against correct_answer, so keep
# answers short and unambiguous - single words/numbers/true-false.
# ---------------------------------------------------------------------------

PYTHON_QUESTIONS = {
    'beginner': [
        ('What does len([1, 2, 3]) return?', 'mcq', ['2', '3', '4', 'Error'], '3', 1),
        ('Which keyword defines a function in Python?', 'mcq', ['func', 'def', 'function', 'lambda'], 'def', 1),
        ('Is Python dynamically typed?', 'true_false', ['true', 'false'], 'true', 1),
        ('What is the output of type(5.0)?', 'mcq', ['int', 'float', 'str', 'double'], 'float', 1),
        ('Which symbol starts a comment in Python?', 'mcq', ['//', '#', '--', '/*'], '#', 1),
    ],
    'intermediate': [
        ('What does the "self" parameter refer to in a class method?', 'mcq',
         ['the class itself', 'the instance calling the method', 'a global variable', 'nothing'],
         'the instance calling the method', 1),
        ('Which built-in creates an iterator that produces values lazily?', 'mcq',
         ['list', 'generator', 'tuple', 'set'], 'generator', 1),
        ('What does *args allow a function to accept?', 'mcq',
         ['keyword arguments', 'a variable number of positional arguments', 'only one argument', 'nothing'],
         'a variable number of positional arguments', 1),
        ('Are Python lists mutable?', 'true_false', ['true', 'false'], 'true', 1),
        ('What exception is raised when dividing by zero?', 'mcq',
         ['ValueError', 'ZeroDivisionError', 'TypeError', 'ArithmeticError'], 'ZeroDivisionError', 1),
    ],
    'advanced': [
        ('What does the GIL stand for in CPython?', 'mcq',
         ['Global Import Lock', 'Global Interpreter Lock', 'Generic Instance Lock', 'General Init Loop'],
         'Global Interpreter Lock', 1),
        ('What does a decorator do to a function?', 'mcq',
         ['deletes it', 'wraps and extends its behavior without modifying its code',
          'converts it to a class', 'compiles it to C'],
         'wraps and extends its behavior without modifying its code', 1),
        ('Does Python support true multiple inheritance?', 'true_false', ['true', 'false'], 'true', 1),
        ('What method is called when using the "with" statement on an object?', 'mcq',
         ['__init__', '__enter__', '__call__', '__with__'], '__enter__', 1),
        ('What is the time complexity of dict lookup on average?', 'mcq',
         ['O(1)', 'O(n)', 'O(log n)', 'O(n^2)'], 'O(1)', 1),
    ],
}

SQL_QUESTIONS = {
    'beginner': [
        ('Which statement retrieves data from a table?', 'mcq',
         ['GET', 'SELECT', 'FETCH', 'PULL'], 'SELECT', 1),
        ('Which clause filters rows before grouping?', 'mcq',
         ['HAVING', 'WHERE', 'GROUP BY', 'ORDER BY'], 'WHERE', 1),
        ('Does SQL use the keyword FROM to specify a table?', 'true_false', ['true', 'false'], 'true', 1),
        ('Which keyword removes duplicate rows from results?', 'mcq',
         ['UNIQUE', 'DISTINCT', 'FILTER', 'NODUP'], 'DISTINCT', 1),
        ('What symbol is commonly used as a wildcard in SELECT * ?', 'mcq',
         ['%', '#', '*', '?'], '*', 1),
    ],
    'intermediate': [
        ('Which JOIN returns only matching rows from both tables?', 'mcq',
         ['LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL JOIN'], 'INNER JOIN', 1),
        ('Which clause filters groups after aggregation?', 'mcq',
         ['WHERE', 'HAVING', 'GROUP BY', 'FILTER'], 'HAVING', 1),
        ('Does a PRIMARY KEY allow NULL values?', 'true_false', ['true', 'false'], 'false', 1),
        ('Which function counts the number of rows?', 'mcq',
         ['SUM()', 'COUNT()', 'TOTAL()', 'LEN()'], 'COUNT()', 1),
        ('What does a FOREIGN KEY enforce?', 'mcq',
         ['uniqueness', 'a relationship between two tables', 'sort order', 'encryption'],
         'a relationship between two tables', 1),
    ],
    'advanced': [
        ('What does a window function like RANK() OVER() do?', 'mcq',
         ['deletes duplicate rows', 'computes a value across a set of rows related to the current row',
          'creates a new table', 'locks the table'],
         'computes a value across a set of rows related to the current row', 1),
        ('Does adding an index always speed up write operations?', 'true_false', ['true', 'false'], 'false', 1),
        ('What isolation level prevents dirty reads but allows non-repeatable reads?', 'mcq',
         ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'], 'READ COMMITTED', 1),
        ('What is a CTE used for?', 'mcq',
         ['creating a temporary named result set for use within a query',
          'encrypting a column', 'compressing a table', 'creating an index'],
         'creating a temporary named result set for use within a query', 1),
        ('Can a subquery in the WHERE clause reference the outer query (correlated subquery)?',
         'true_false', ['true', 'false'], 'true', 1),
    ],
}

DOCKER_QUESTIONS = {
    'beginner': [
        ('What file defines how a Docker image is built?', 'mcq',
         ['docker-compose.yml', 'Dockerfile', 'image.json', 'build.txt'], 'Dockerfile', 1),
        ('Is a Docker container the same as a virtual machine?', 'true_false', ['true', 'false'], 'false', 1),
        ('Which command starts a container from an image?', 'mcq',
         ['docker start', 'docker run', 'docker build', 'docker init'], 'docker run', 1),
        ('What does the EXPOSE instruction in a Dockerfile do?', 'mcq',
         ['runs the app', 'documents which port the container listens on',
          'installs dependencies', 'deletes a layer'],
         'documents which port the container listens on', 1),
        ('Which command lists running containers?', 'mcq',
         ['docker list', 'docker ps', 'docker show', 'docker containers'], 'docker ps', 1),
    ],
    'intermediate': [
        ('What does docker-compose.yml let you do?', 'mcq',
         ['write Python code', 'define and run multi-container applications',
          'compile images to binaries', 'replace Dockerfiles entirely'],
         'define and run multi-container applications', 1),
        ('Do changes inside a running container persist after it is removed, by default?',
         'true_false', ['true', 'false'], 'false', 1),
        ('What is a Docker volume used for?', 'mcq',
         ['networking between containers', 'persisting data outside a container\'s lifecycle',
          'building images faster', 'securing ports'],
         'persisting data outside a container\'s lifecycle', 1),
        ('Which command shows a container\'s logs?', 'mcq',
         ['docker log', 'docker logs', 'docker show-log', 'docker output'], 'docker logs', 1),
        ('What does "depends_on" in docker-compose.yml control?', 'mcq',
         ['CPU allocation', 'startup order between services', 'network encryption', 'image size'],
         'startup order between services', 1),
    ],
    'advanced': [
        ('What is the main benefit of multi-stage builds in a Dockerfile?', 'mcq',
         ['faster networking', 'smaller final images by discarding build-only dependencies',
          'automatic scaling', 'built-in load balancing'],
         'smaller final images by discarding build-only dependencies', 1),
        ('Does "depends_on: condition: service_healthy" wait for a healthcheck to pass?',
         'true_false', ['true', 'false'], 'true', 1),
        ('What does docker exec -it <container> bash do?', 'mcq',
         ['rebuilds the image', 'opens an interactive shell inside a running container',
          'stops the container', 'deletes the container'],
         'opens an interactive shell inside a running container', 1),
        ('What layer caching behavior speeds up rebuilds?', 'mcq',
         ['Docker reuses unchanged layers from previous builds',
          'Docker always rebuilds every layer', 'Docker deletes the cache after each build',
          'Docker ignores the Dockerfile order'],
         'Docker reuses unchanged layers from previous builds', 1),
        ('Can a single Dockerfile produce multiple different final images?', 'true_false',
         ['true', 'false'], 'true', 1),
    ],
}

JAVASCRIPT_QUESTIONS = {
    'beginner': [
        ('Which keyword declares a block-scoped variable in JS?', 'mcq',
         ['var', 'let', 'define', 'const only'], 'let', 1),
        ('What does typeof "hello" return?', 'mcq', ['object', 'string', 'text', 'char'], 'string', 1),
        ('Is JavaScript case-sensitive?', 'true_false', ['true', 'false'], 'true', 1),
        ('Which method adds an item to the end of an array?', 'mcq',
         ['push()', 'append()', 'add()', 'insert()'], 'push()', 1),
    ],
    'intermediate': [
        ('What does the "this" keyword refer to inside a regular function called as a method?', 'mcq',
         ['the global object always', 'the object the method was called on', 'undefined always', 'the function itself'],
         'the object the method was called on', 1),
        ('Does === check both value and type in JavaScript?', 'true_false', ['true', 'false'], 'true', 1),
        ('What does Array.prototype.map() return?', 'mcq',
         ['the original array modified', 'a new array with transformed elements',
          'a single value', 'nothing'],
         'a new array with transformed elements', 1),
        ('What is a closure in JavaScript?', 'mcq',
         ['a syntax error', 'a function that remembers variables from its outer scope',
          'a way to close a browser tab', 'a type of loop'],
         'a function that remembers variables from its outer scope', 1),
    ],
    'advanced': [
        ('What does async/await primarily simplify?', 'mcq',
         ['CSS styling', 'working with Promises without chaining .then()',
          'DOM manipulation', 'variable declaration'],
         'working with Promises without chaining .then()', 1),
        ('Is the event loop single-threaded in standard JavaScript engines?', 'true_false',
         ['true', 'false'], 'true', 1),
        ('What does Object.freeze() do to an object?', 'mcq',
         ['deletes it', 'prevents adding, removing, or modifying its properties',
          'converts it to JSON', 'clones it deeply'],
         'prevents adding, removing, or modifying its properties', 1),
        ('What is "hoisting" in JavaScript?', 'mcq',
         ['moving code to a server', 'variable and function declarations being moved to the top of their scope',
          'a CSS positioning technique', 'a debugging tool'],
         'variable and function declarations being moved to the top of their scope', 1),
    ],
}

HTML_QUESTIONS = {
    'beginner': [
        ('Which tag defines the largest heading?', 'mcq', ['h6', 'h1', 'head', 'header'], 'h1', 1),
        ('Which attribute specifies an image source?', 'mcq', ['href', 'src', 'link', 'source'], 'src', 1),
        ('Does the <br> tag require a closing tag in HTML5?', 'true_false', ['true', 'false'], 'false', 1),
        ('Which tag is used to create a hyperlink?', 'mcq', ['<link>', '<a>', '<href>', '<url>'], '<a>', 1),
    ],
    'intermediate': [
        ('What does the "alt" attribute on an <img> provide?', 'mcq',
         ['the image file size', 'alternative text for accessibility and when the image fails to load',
          'the image alignment', 'the image border'],
         'alternative text for accessibility and when the image fails to load', 1),
        ('Is <div> a semantic HTML element?', 'true_false', ['true', 'false'], 'false', 1),
        ('Which element is used for a dropdown selection list?', 'mcq',
         ['<list>', '<select>', '<dropdown>', '<option>'], '<select>', 1),
        ('What does the <form> action attribute specify?', 'mcq',
         ['the form styling', 'where form data is sent when submitted',
          'the form language', 'the form title'],
         'where form data is sent when submitted', 1),
    ],
    'advanced': [
        ('What is the purpose of the <meta viewport> tag?', 'mcq',
         ['loads external CSS', 'controls layout on mobile browsers for responsive design',
          'sets the page title', 'defines the character encoding'],
         'controls layout on mobile browsers for responsive design', 1),
        ('Does the <article> tag have semantic meaning distinct from <div>?', 'true_false',
         ['true', 'false'], 'true', 1),
        ('What does the "defer" attribute on a <script> tag do?', 'mcq',
         ['runs the script immediately', 'delays script execution until after HTML parsing completes',
          'deletes the script', 'runs the script only on mobile'],
         'delays script execution until after HTML parsing completes', 1),
        ('Which ARIA attribute helps screen readers identify a landmark region?', 'mcq',
         ['aria-role', 'role', 'aria-label only', 'tabindex'], 'role', 1),
    ],
}

CSS_QUESTIONS = {
    'beginner': [
        ('Which property changes text color?', 'mcq', ['font-color', 'text-color', 'color', 'text-style'], 'color', 1),
        ('Which symbol targets a class selector?', 'mcq', ['#', '.', '*', '&'], '.', 1),
        ('Does CSS stand for Cascading Style Sheets?', 'true_false', ['true', 'false'], 'true', 1),
        ('Which property controls the space inside an element\'s border?', 'mcq',
         ['margin', 'padding', 'border', 'spacing'], 'padding', 1),
    ],
    'intermediate': [
        ('What does the CSS box model NOT include?', 'mcq',
         ['margin', 'border', 'padding', 'z-index'], 'z-index', 1),
        ('Does "position: absolute" position an element relative to its nearest positioned ancestor?',
         'true_false', ['true', 'false'], 'true', 1),
        ('Which display value creates a flexible box layout?', 'mcq',
         ['block', 'flex', 'inline', 'grid-only'], 'flex', 1),
        ('What does "z-index" control?', 'mcq',
         ['element width', 'stacking order along the z-axis', 'font size', 'border radius'],
         'stacking order along the z-axis', 1),
    ],
    'advanced': [
        ('What problem does CSS specificity resolve?', 'mcq',
         ['which browser to use', 'which conflicting style rule applies to an element',
          'page load speed', 'which fonts are available'],
         'which conflicting style rule applies to an element', 1),
        ('Does "display: grid" support both rows and columns natively?', 'true_false',
         ['true', 'false'], 'true', 1),
        ('What does a CSS custom property (variable) look like?', 'mcq',
         ['$primary-color', '--primary-color', '@primary-color', '#primary-color'],
         '--primary-color', 1),
        ('What does "will-change" hint to the browser?', 'mcq',
         ['a property is about to change and can be optimized ahead of time',
          'the element will be deleted', 'the font will change', 'nothing, it is deprecated'],
         'a property is about to change and can be optimized ahead of time', 1),
    ],
}

JAVA_QUESTIONS = {
    'beginner': [
        ('Which keyword is used to create a class in Java?', 'mcq',
         ['class', 'struct', 'object', 'def'], 'class', 1),
        ('Is Java platform-independent via the JVM?', 'true_false', ['true', 'false'], 'true', 1),
        ('Which method is the entry point of a Java program?', 'mcq',
         ['start()', 'main()', 'run()', 'init()'], 'main()', 1),
        ('Which keyword creates a new object instance?', 'mcq', ['new', 'create', 'make', 'init'], 'new', 1),
    ],
    'intermediate': [
        ('What does the "extends" keyword do in Java?', 'mcq',
         ['implements an interface', 'inherits from a superclass',
          'declares a variable', 'imports a package'],
         'inherits from a superclass', 1),
        ('Can a Java class implement multiple interfaces?', 'true_false', ['true', 'false'], 'true', 1),
        ('What does the "final" keyword prevent for a variable?', 'mcq',
         ['it from being printed', 'its value from being reassigned after initialization',
          'garbage collection', 'inheritance'],
         'its value from being reassigned after initialization', 1),
        ('What is the parent class of all classes in Java?', 'mcq',
         ['Main', 'Object', 'Base', 'Root'], 'Object', 1),
    ],
    'advanced': [
        ('What does the JVM garbage collector manage?', 'mcq',
         ['CPU scheduling', 'automatic memory reclamation for unused objects',
          'file compression', 'network sockets'],
         'automatic memory reclamation for unused objects', 1),
        ('Does Java support multiple inheritance of classes (not interfaces)?', 'true_false',
         ['true', 'false'], 'false', 1),
        ('What does the "synchronized" keyword help prevent in multithreading?', 'mcq',
         ['memory leaks', 'race conditions on shared resources', 'compiler errors', 'null pointer exceptions'],
         'race conditions on shared resources', 1),
        ('What is the purpose of a Java interface?', 'mcq',
         ['to store data only', 'to define a contract of methods a class must implement',
          'to replace classes entirely', 'to manage memory'],
         'to define a contract of methods a class must implement', 1),
    ],
}

GITHUB_QUESTIONS = {
    'beginner': [
        ('Which command uploads local commits to a remote repository?', 'mcq',
         ['git upload', 'git push', 'git send', 'git commit'], 'git push', 1),
        ('Is a "fork" a personal copy of someone else\'s repository?', 'true_false', ['true', 'false'], 'true', 1),
        ('Which command downloads a repository to your local machine?', 'mcq',
         ['git download', 'git clone', 'git copy', 'git fetch-all'], 'git clone', 1),
        ('What is a "pull request" used for?', 'mcq',
         ['deleting a branch', 'proposing changes to be merged into another branch',
          'downloading a repo', 'renaming a repo'],
         'proposing changes to be merged into another branch', 1),
    ],
    'intermediate': [
        ('What does "git merge" do?', 'mcq',
         ['deletes a branch', 'combines changes from one branch into another',
          'creates a new repository', 'reverts a commit'],
         'combines changes from one branch into another', 1),
        ('Does a merge conflict occur when Git cannot automatically reconcile changes?', 'true_false',
         ['true', 'false'], 'true', 1),
        ('What does ".gitignore" do?', 'mcq',
         ['deletes files permanently', 'tells Git which files/folders not to track',
          'encrypts a repository', 'speeds up cloning'],
         'tells Git which files/folders not to track', 1),
        ('What is the difference between "git fetch" and "git pull"?', 'mcq',
         ['there is no difference', 'fetch downloads changes without merging, pull fetches and merges',
          'pull only works on GitHub, fetch works locally', 'fetch deletes branches'],
         'fetch downloads changes without merging, pull fetches and merges', 1),
    ],
    'advanced': [
        ('What does "git rebase" do differently from "git merge"?', 'mcq',
         ['nothing, they are identical', 'it rewrites commit history onto a new base instead of creating a merge commit',
          'it deletes all commits', 'it only works on GitHub Actions'],
         'it rewrites commit history onto a new base instead of creating a merge commit', 1),
        ('Can GitHub Actions run automated workflows on push or pull request events?', 'true_false',
         ['true', 'false'], 'true', 1),
        ('What does "git cherry-pick" do?', 'mcq',
         ['deletes a specific commit', 'applies a specific commit from one branch onto another',
          'merges all branches', 'creates a tag'],
         'applies a specific commit from one branch onto another', 1),
        ('What is the purpose of branch protection rules on GitHub?', 'mcq',
         ['to speed up cloning', 'to enforce requirements like reviews before merging to a branch',
          'to hide a repository', 'to compress commit history'],
         'to enforce requirements like reviews before merging to a branch', 1),
    ],
}

MYSQL_QUESTIONS = {
    'beginner': [
        ('Which command creates a new database in MySQL?', 'mcq',
         ['NEW DATABASE', 'CREATE DATABASE', 'MAKE DATABASE', 'ADD DATABASE'], 'CREATE DATABASE', 1),
        ('Is MySQL a relational database management system?', 'true_false', ['true', 'false'], 'true', 1),
        ('Which data type stores whole numbers in MySQL?', 'mcq',
         ['VARCHAR', 'INT', 'TEXT', 'BOOLEAN'], 'INT', 1),
        ('Which command removes a table entirely?', 'mcq',
         ['DELETE TABLE', 'DROP TABLE', 'REMOVE TABLE', 'CLEAR TABLE'], 'DROP TABLE', 1),
    ],
    'intermediate': [
        ('What is the purpose of AUTO_INCREMENT in MySQL?', 'mcq',
         ['encrypts a column', 'automatically generates a unique sequential number for new rows',
          'compresses table size', 'sorts a table alphabetically'],
         'automatically generates a unique sequential number for new rows', 1),
        ('Does adding an index always improve every query\'s performance?', 'true_false',
         ['true', 'false'], 'false', 1),
        ('What does the ENGINE=InnoDB setting provide that MyISAM historically did not?', 'mcq',
         ['faster reads only', 'transaction support and foreign key constraints',
          'smaller file size', 'built-in encryption'],
         'transaction support and foreign key constraints', 1),
        ('What does a UNIQUE constraint enforce?', 'mcq',
         ['sorted order', 'no two rows can have the same value in that column',
          'automatic backups', 'faster writes'],
         'no two rows can have the same value in that column', 1),
    ],
    'advanced': [
        ('What is the main purpose of database normalization?', 'mcq',
         ['making queries slower', 'reducing data redundancy and improving data integrity',
          'increasing storage size', 'removing all foreign keys'],
         'reducing data redundancy and improving data integrity', 1),
        ('Can MySQL replication be used to keep a read replica in sync with a primary database?',
         'true_false', ['true', 'false'], 'true', 1),
        ('What does EXPLAIN show when placed before a SELECT query?', 'mcq',
         ['the query results', 'how MySQL plans to execute the query',
          'the table schema only', 'a backup of the table'],
         'how MySQL plans to execute the query', 1),
        ('What is a deadlock in the context of a MySQL transaction?', 'mcq',
         ['a syntax error', 'two or more transactions waiting on each other\'s locks indefinitely',
          'a corrupted table', 'a missing index'],
         'two or more transactions waiting on each other\'s locks indefinitely', 1),
    ],
}

SKILL_BANKS = {
    'Python': PYTHON_QUESTIONS,
    'SQL': SQL_QUESTIONS,
    'Docker': DOCKER_QUESTIONS,
    'JavaScript': JAVASCRIPT_QUESTIONS,
    'HTML': HTML_QUESTIONS,
    'CSS': CSS_QUESTIONS,
    'Java': JAVA_QUESTIONS,
    'GitHub': GITHUB_QUESTIONS,
    'MySQL': MYSQL_QUESTIONS,
}


class Command(BaseCommand):
    help = 'Seeds a demo-ready question bank (Python, SQL, Docker x beginner/intermediate/advanced).'

    @transaction.atomic
    def handle(self, *args, **options):
        total_pools = 0
        total_questions = 0

        for skill_name, difficulty_map in SKILL_BANKS.items():
            skill, _ = Skill.objects.get_or_create(
                slug=skill_name.lower(), defaults={'name': skill_name},
            )

            for difficulty, questions in difficulty_map.items():
                pool, _ = Assessment.objects.get_or_create(
                    skill=skill, difficulty=difficulty,
                    defaults={'title': f'{skill_name} - {difficulty.title()}'},
                )
                total_pools += 1

                for text, q_type, options, correct_answer, points in questions:
                    _, created = Question.objects.get_or_create(
                        assessment=pool, text=text,
                        defaults={
                            'question_type': q_type,
                            'options': options,
                            'correct_answer': correct_answer,
                            'points': points,
                        },
                    )
                    if created:
                        total_questions += 1

        self.stdout.write(self.style.SUCCESS(
            f'Question bank ready: {total_pools} pools, {total_questions} new questions created '
            f'across {len(SKILL_BANKS)} skills.'
        ))