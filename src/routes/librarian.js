import Layout from "@/components/librarian/librarianLayout.vue";

export default [
  {
    path: "/librarian",
    component: Layout,
    children: [
      {
        path: "home",
        name: "librarianHome",
        component: () => import("@/components/librarian/librarianHome.vue"),
      },
      {
        path: "books",
        name: "librarianBook",
        component: () => import("@/components/librarian/librarianBook.vue"),
      },
      {
        path: "section",
        name: "librarianSection",
        component: () => import("@/components/librarian/librarianSection.vue"),
      },
      {
        path: "book/:id",
        name: "librarianbookDetails",
        component: () => import("@/components/librarian/bookDetails.vue"),
      },
      {
        path: "section/:id",
        name: "librarianSectionDetails",
        component: () => import("@/components/librarian/sectionDetails.vue"),
      },
      {
        path: "manage",
        name: "ManageDetails",
        component: () => import("@/components/librarian/ManageRequests.vue")
      }
    ],
  },
  {
    path: "/librarian/book/:book_id/read",
    name: "readBook",
    component: () => import("@/components/librarian/readBook.vue"),
  },
];
